const path = require('path');
const fs = require('fs');
const { promisify } = require('util');
const AWS = require('aws-sdk');
const mime = require('mime-types');
const readdir = promisify(fs.readdir);

const region = process.env.REACT_APP_REGION
  || 'us-east-1';
const stackName = process.env.REACT_APP_STACK_NAME
  || 'csr-portal';

let profile = process.argv[2];
if (profile === undefined || profile === null) {
  console.log("SPECIFY PROFILE AS FIRST COMMAND PARAM");
  return;
}
if (profile !== "skip") {
  AWS.config.credentials = new AWS.SharedIniFileCredentials({ profile: profile });
}
AWS.config.update({ region });

const cloudFormation = new AWS.CloudFormation();
const cloudFront = new AWS.CloudFront();
const s3 = new AWS.S3();

const flatMap = (val, mapper) => Array.isArray(val) ?
  [].concat(val.map(x => flatMap(x, mapper))) :
  mapper(val);
const walkDir = (dir, cb) => readdir(dir).then(ps => {
  return Promise.all(flatMap(ps, p => {
    const file = path.join(dir, p);
    const stat = fs.statSync(file);
    if (stat.isFile()) {
      return cb(file);
    } else if (stat.isDirectory()) {
      return walkDir(file, cb);
    } else {
      return Promise.resolve();
    }
  }));
});

const uploadDir = (dir, dest, bucket) => walkDir(dir, f => {
  console.log(path.join(dest, f.substring(dir.length + 1)));
  return f ? s3.putObject({
    Bucket: bucket,
    Key: path.join(dest, f.substring(dir.length + 1)),
    ContentType: mime.lookup(f.substring(dir.length + 1))
      || 'application/octet-stream',
    Body: fs.readFileSync(f),
    ACL: 'public-read'
  }).promise() : Promise.resolve();
});

let bucketId;
let cdnId;
let indexFile;

cloudFormation.listStacks({}).promise().then(data => {
  const stacks = data.StackSummaries;
  if (stacks.find(s => s.StackName === stackName && s.StackStatus !== "DELETE_COMPLETE")) {
    console.log(`${stackName} already exists!`);
    return cloudFormation.describeStackResources({
      StackName: stackName
    }).promise();
  }
  console.log(`${stackName} doesn't exist.`);
  console.log(`Creating ${stackName}...`);
  return cloudFormation.createStack({
    StackName: stackName,
    Capabilities: ['CAPABILITY_IAM'],
    OnFailure: 'ROLLBACK',
    TemplateBody: fs.readFileSync(
      `${__dirname}/cloudformation.yml`,
      'utf8'
    )
  }).promise().then(ret => {
    console.log(`Waiting for ${stackName} to complete...`);
    return cloudFormation.waitFor('stackCreateComplete', {
      StackName: stackName
    }).promise().then(() => {
      console.log('Stack created successfully!!');
    });
  }).then(ret => cloudFormation.describeStackResources({
    StackName: stackName
  }).promise());
}).then(data => {
  bucketId = data.StackResources.find(r =>
    r.LogicalResourceId === 'StaticContentBucket'
  ).PhysicalResourceId;
  cdnId = data.StackResources.find(r =>
    r.LogicalResourceId === 'WebsiteCDN'
  ).PhysicalResourceId;
  const distFiles = fs.readdirSync('build');
  indexFile = distFiles.find(f =>
    f.indexOf('index.html') !== -1
  );
  let staticDir = distFiles.find(f =>
    f.indexOf('static') !== -1
  );
  if (!indexFile || !staticDir) {
    throw new Error('Bad Build');
  }
  indexFile = path.join('build', indexFile);
  const buildFolder = path.resolve(`${path.resolve()}/build`);
  staticDir = path.join(buildFolder, staticDir);
  console.log(`Uploading ${staticDir} to ${bucketId}...`);
  // TODO: this uploads whole build folder, cleanup
  return uploadDir(buildFolder, "./", bucketId);
}).then(rets => {
  console.log('Successfully uploaded static directory!');
  console.log('Uploading index file...');
  // TODO move current index file to index.html + hash
  return s3.putObject({
    Bucket: bucketId,
    Key: path.basename(indexFile),
    ContentType: 'text/html',
    Body: fs.readFileSync(indexFile)
  }).promise();
}).then(ret => {
  console.log('Sucessfully uploaded index file!');
  console.log('Creating invalidation...');
  return cloudFront.createInvalidation({
    DistributionId: cdnId,
    InvalidationBatch: {
      CallerReference: Math.floor(new Date() / 1000)
        .toString(),
      Paths: {
        Quantity: 1,
        Items: ['/index.html']
      }
    }
  }).promise();
}).then(ret => {
  console.log('Invalidation created!');
  console.log('Waiting for invalidation to complete...');
  return cloudFront.waitFor('invalidationCompleted', {
    DistributionId: cdnId,
    Id: ret.Invalidation.Id
  }).promise();
}).then(() => {
  console.log('Invalidation completed!');
}).catch(console.error);