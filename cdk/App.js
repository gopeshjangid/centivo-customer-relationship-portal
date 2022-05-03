const core = require('@aws-cdk/core');
const CodeCommitBuildStack = require('centivo-cdk/src/cdk/stacks').repo.CodeCommitBuildStack;

module.exports = class App extends core.App {
    constructor(argv) {
        super(argv);

        new CodeCommitBuildStack(this, `${process.env.APP_NAME || 'CsrPortalFrontEnd'}Build${process.env.ENVIRONMENT || 'Dev'}`, {
            env: {
                region: "us-east-1"
            },
            codeCommitArn: process.env.CODE_COMMIT_ARN,
            gitBranch: process.env.GIT_BRANCH || 'master',
            deploymentRole: process.env.DEPLOYMENT_ROLE,
            commands: [
                'npm install -g npm@6.14.12',
                'npm install -g yarn',
                // 'yarn install --frozen-lockfile',
                'yarn',
                'npm install -g awsudo',
                'npm run-script ' + process.env.BUILD_SCRIPT || 'build:dev',
                `awsudo ${process.env.DEPLOYMENT_ROLE} "npm run-script deploy skip"`,
            ]
        });
    }
}