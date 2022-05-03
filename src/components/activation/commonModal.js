import React from 'react';
import ModalDialog from '../modal-dialog/modalDialog';
import { Alert } from 'reactstrap';
import { ClipLoader } from 'react-spinners';

const CommonModal = props => {
  return (
    <ModalDialog
      showModal={true}
      className="csr-activation"
      noCloseIcon={true}
      fade={false}
      footerBtns={
        props.children && [
          {
            key: 'cancel',
            text: 'Cancel',
            className: 'cancel-btn',
            onclick: props.onToggle
          }
        ]
      }
    >
      {props.children ? (
        <Alert color="danger" className="text-center">
          {props.children}
        </Alert>
      ) : (
        <div className="text-center">
          <ClipLoader loading={true} />
        </div>
      )}
    </ModalDialog>
  );
};

export default CommonModal;
