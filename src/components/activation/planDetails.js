import React from 'react';
import ModalDialog from '../modal-dialog/modalDialog';

const PlanDetails = props => {
  return (
    <ModalDialog
      title="Learn about the plan"
      showModal={true}
      className="csr-activation"
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
          key: 'next',
          text: 'Next',
          className: 'primary-btn',
          onclick: () => props.toggleActivationScreen('familyMembers')
        }
      ]}
    >
      <div className="about-plan">
        <p>
          In addition to helping you select a Primary Care Physician for you
          [and your family members], I'd also like to share how to best use your
          health plan.
        </p>
        <ul>
          <li>
            For any care that is not an emergency, we recommend you go to your{' '}
            <strong>Primary Care Physician</strong>'s office. They can help with
            most of your care needs and will cost you less money than other
            providers.
          </li>
          <li>
            If the office is closed or you can't get a hold of your doctor then
            you should visit an <strong>urgent care</strong> clinic. Only go to
            the ER for serious or life-threatening emergencies, since the ER
            visit will be expensive and there may be a long wait to be seen.
          </li>
          <li>
            [Assuming the member has a referral-based plan] Be sure to get a{' '}
            <strong>referral</strong> from your Primary Care Physician or a
            clinical staff member in the office before seeing a specialist.
          </li>
        </ul>
      </div>
    </ModalDialog>
  );
};

export default PlanDetails;
