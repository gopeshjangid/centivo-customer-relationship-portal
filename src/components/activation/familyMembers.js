import React from 'react';
import ModalDialog from '../modal-dialog/modalDialog';

const FamilyMembers = props => {
  const familyMembers = JSON.parse(
    sessionStorage.getItem('familyMembers')
  ).filter(member => member.memberUuid === props.memberId)[0];
  return (
    <ModalDialog
      title="Choose a family member"
      showModal={true}
      className="csr-activation family"
      onToggle={props.onToggle}
      noCloseIcon={true}
      footerBtns={[
        {
          key: 'cancel',
          text: 'Cancel',
          className: 'cancel-btn',
          onclick: props.onToggle
        },
        {
          key: 'complete',
          text: 'Complete',
          className: 'primary-btn',
          onclick: props.onToggle,
          disabled:
            props.allMembers &&
            props.allMembers.filter(member => member.pcp).length === 0
        }
      ]}
    >
      <div className="family-members">
        {/* <div className="family-member" key={familyMembers.employeeUuid}>
          <div>
            <h4>{familyMembers.firstName}</h4>
            {props.careDetails && props.careDetails.PcpDetail && (
              <div>
                <span className="pcpPracticeName">
                  {props.careDetails.PcpDetail.practiceSummary.practiceName}
                </span>
                <span className="pcpName">
                  {
                    props.careDetails.PcpDetail.providerSummary
                      .providerFirstName
                  }{' '}
                  {props.careDetails.PcpDetail.providerSummary.providerLastName}
                </span>
              </div>
            )}
          </div>
          <button onClick={() => props.toggleActivationScreen('searchPcp')}>
            {props.careDetails && props.careDetails.PcpDetail ? 'Edit' : 'Add'}
            <i
              className={`icon ${
                props.careDetails && props.careDetails.PcpDetail
                  ? 'icon-edit-red'
                  : 'icon-plus'
              }`}
            />
          </button>
        </div> */}
        {props.allMembers &&
          props.allMembers.map(member => {
            return (
              <div className="family-member" key={member.memberUuid}>
                <div>
                  <h4>{member.firstName}</h4>
                  {member.pcp && (
                    <div>
                      <span className="pcpPracticeName">
                        {member.pcpPracticeName}
                      </span>
                      <span className="pcpName">
                        {member.pcpFirstName} {member.pcpLastName},{' '}
                        {member.pcpTitle}
                      </span>
                    </div>
                  )}
                </div>

                <button onClick={() => props.changeMemberPcpData(member)}>
                  {member.pcp ? 'Edit' : 'Add'}
                  <i
                    className={`icon ${member.pcp ? 'icon-edit-red' : 'icon-plus'
                      }`}
                  />
                </button>
              </div>
            );
          })}
      </div>
    </ModalDialog>
  );
};

export default FamilyMembers;
