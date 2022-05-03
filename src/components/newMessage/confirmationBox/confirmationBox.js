import React from 'react';
import {Loader} from './../../wrapper';

const ConfirmationBox = ({
    criteria,
    criteriaSearch,
    criteriaType,
    selMemberNames,
    templateUuid,
    description,
    sendingEmails
  }) => {
    let {
      tier,
      activation,
      dependentFilter,
      planList
    } = criteriaSearch;
    return (
      <>
       {sendingEmails && <Loader /> }
      
      <div>
        {
         (
            <div>
          {planList && planList.length !== 0 && (
            <div className="selected-options-description">
              <span className="criteria-search-categories">
                Plan Type:{' '}
              </span>
              <span className="criteria-search-selected">
                {planList.join(', ')}
              </span>
            </div>
          )}
          {tier && tier.length !== 0 && (
            <div className="selected-options-description">
              <span className="criteria-search-categories">
                Coverage Type:{' '}
              </span>
              <span className="criteria-search-selected">{tier.join(', ')}</span>
            </div>
          )}
          {activation && activation.length !== 0 && (
            <div className="selected-options-description">
              <span className="criteria-search-categories">
                Activation Status:{' '}
              </span>
              <span className="criteria-search-selected">
                {activation.join(', ')}
              </span>
            </div>
          )}
          {dependentFilter && dependentFilter.length !== 0 && (
            <div className="selected-options-description">
              <span className="criteria-search-categories">
                Employee Type:{' '}
              </span>
              <span className="criteria-search-selected">
                {dependentFilter.join(', ')}
              </span>
            </div>
          )}
          {templateUuid && (
            <div className="selected-options-description">
              <span className="criteria-search-categories">
                Template:{' '}
              </span>
              <span className="criteria-search-selected">{templateUuid}</span>
            </div>
          )}
          {description && (
            <div className="selected-options-description">
              <span className="criteria-search-categories">
                Description:{' '}
              </span>
              <span className="criteria-search-selected">{description}</span>
            </div>
          )}
        </div>
          )
        }
        
      </div>
      </>
    );
  };

  export default ConfirmationBox;