import React, { useState, useRef, useEffect } from "react";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, InputGroup, InputGroupAddon, Input, Row, Col } from "reactstrap";
import { AttachmentIcon, DeleteIcon } from "../../assets/icons/components";
import { _global } from "./../../helpers/global";
import Dropzone from "react-dropzone";
import "./css/attachment.scss";
require("./css/modal-dialog.css");

const ModalDialog = (props) => {
  const preventClick = (e) => {
    e.stopPropagation();
  };
  const inputFile = useRef(null);
  const [files, setFiles] = useState([]);
  const [isButtonDisabled, setIsButtonDisabled] = useState();
  const attachFileHandler = (e) => {
    inputFile.current.click();
  };

  useEffect(() => {
    props.footerBtnsAttachement &&
      props.displayAttachmentsIcon({
        component: files.length ? (
          <div className="email-attachments-wrapper">
            {files.map((file, index) => {
              return (
                <div className="email-attachment" key={file.name + index}>
                  <div className="top">
                    <div className="card-icon">{_global.getIconBasedOnFileType(file.type)}</div>
                    <div className="file-desc">
                      <p>{file.name}</p>
                      <p style={{ fontSize: "12px" }}>{_global.niceBytes(file.size)}</p>
                    </div>
                  </div>

                  <div
                    className="cross-icon"
                    // onClick={() => setFiles(files.filter((f) => f.name !== file.name))}
                    onClick={() => {
                      setFiles(
                        files.filter((f, i) => {
                          // console.log(i);
                          // console.log("index", index);
                          return i !== index;
                        })
                      );
                    }}
                  >
                    {/* {index} */}
                    <DeleteIcon />
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <></>
        ),
        files: files,
      });
  }, [files]);

  const clearErrorMessageHandler = () => {
    props.displayAttachmentsError && props.displayAttachmentsError(<></>);
    setIsButtonDisabled(false);
  };

  const onFileUpload = (e) => {
    const supportedExtensions = [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'application/pdf',
      'application/doc',
      'application/docx',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/msword'
    ];
    let filesArray = e.target.files;
    let array = [];
    let uploadedFilesSize = 0;
    for (var i = 0; i < filesArray.length; i++) {
      if (supportedExtensions.includes(filesArray[i].type)) {
        uploadedFilesSize = uploadedFilesSize + filesArray[i].size;
        array.push(filesArray[i]);
      }
    }
    let totalSize = files.map((f) => f.size).reduce((a, b) => a + b, 0);
    if (uploadedFilesSize < 26214400 && totalSize + uploadedFilesSize < 26214400) {
      setFiles([...files, ...array]);
      clearErrorMessageHandler();
      setIsButtonDisabled(false);
    } else {
      //alert("Total size of files are greater than 25MB");
      setIsButtonDisabled(true);
      props.displayAttachmentsError(
        <div className="file-size-error">
          <div onClick={clearErrorMessageHandler}>
            <DeleteIcon circleFill="#D62020" />
          </div>
          <div>File size too large. Max size 25MB.</div>
        </div>
      );
    }
  };

  const footerButtonOnclickHandler = (event, footerBtn) => {
    let response = footerBtn.onclick(event);
    response === 'success' && setFiles([]);
  };

  const closeModelHandler = () => {
    setFiles([]);
    props.onToggle();
  }

  return (
    <div>
      <Modal isOpen={props.showModal} toggle={props.onToggle ? props.toggle : null} className={props.className}>
        {props.onToggle && (
          <ModalHeader toggle={props.toggle}>
            <div className="title">{props.title}</div>
            <button className="close" onClick={closeModelHandler}>
              <i className="icon icon-close"></i>
            </button>
          </ModalHeader>
        )}

        <Dropzone onDrop={(acceptedFiles) => onFileUpload({ target: { files: acceptedFiles } })} noClick accept=".pdf, .doc, .docx, .jpg, .png">
          {({ getRootProps, getInputProps, isDragActive }) => (
            <section>
              <div {...getRootProps({})}>
                <input {...getInputProps()} />
                <ModalBody className={isDragActive ? "isDragActive" : ""}>{props.children}</ModalBody>
              </div>
            </section>
          )}
        </Dropzone>

        {props.footerBtns && props.footerBtns.length > 0 && (
          //style={{ justifyContent: "space-between" }}
          <ModalFooter >
            {props.footerBtns.map((footerBtn, index) => {
              return (
                <React.Fragment key={index}>
                  <input
                    type="file"
                    id="file"
                    multiple
                    accept=".pdf, .doc, .docx, .jpg, .png"
                    ref={inputFile}
                    onClick={(e) => (e.target.value = null)}
                    onChange={onFileUpload}
                    style={{ display: "none" }}
                  />
                  {props.footerBtnsAttachement && (
                    <div onClick={attachFileHandler} style={{ padding: '10px' }}>
                      <AttachmentIcon /> <p style={{ display: "inline", marginLeft: "10px", fontSize: '14px', color: '#444444' }}>Attach</p>
                    </div>
                  )}

                  <Button
                    key={footerBtn.key}
                    className={footerBtn.className}
                    onClick={(e) => footerButtonOnclickHandler(e, footerBtn)}
                    color="default"
                    disabled={isButtonDisabled || footerBtn.disabled}
                  >
                    <i className={"fa " + footerBtn.icon} aria-hidden="true" />
                    {footerBtn.text}
                  </Button>
                </React.Fragment>
              );
            })}
          </ModalFooter>
        )}
        {props.inputBtns && props.inputBtns.length > 0 && (
          <ModalFooter>
            <Row>
              {props.inputBtns.map((inputBtn) => {
                return (
                  <Col className="copy-text-inputs" key={inputBtn.key} xs="6">
                    <InputGroup>
                      <Input value={inputBtn.val} readOnly type={inputBtn.type} className={inputBtn.key} />
                      <InputGroupAddon addonType="append" onClick={inputBtn.onclick} data-value={inputBtn.val}></InputGroupAddon>
                    </InputGroup>
                  </Col>
                );
              })}
            </Row>
          </ModalFooter>
        )}
      </Modal>
    </div>
  );
};

export default ModalDialog;
