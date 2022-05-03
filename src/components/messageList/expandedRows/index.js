import React from "react";
import { _global } from "./../../../helpers/global";
import ReactHtmlParser from "react-html-parser";
import { downloadAttachment } from "../../../actions";

const showAttachment = (record, downloadAttachment) => {
  return (
    <div className="email-attachments-wrapper">
      {record.attachments &&
        record.attachments.map((attachment) => {
          return (
            <div key={attachment.Key} className="email-attachment">
              <div className="top">
                <div className="card-icon">{_global.getIconBasedOnFileType(attachment.type)}</div>
                <div className="file-desc">
                  <p>{attachment.name}</p>
                  <p style={{ fontSize: "x-small" }}>{_global.niceBytes(attachment.size)}</p>
                </div>
              </div>
              <div className="buttom">
                <p onClick={() => downloadAttachment({ Key: attachment.Key , filename: attachment.name})}>Download</p>
              </div>
            </div>
          );
        })}
    </div>
  );
};
export const ExpandedRowOutbox = ({ record, downloadAttachment }) => (
  <div className="email-wrapper outbox ">
    <div className="replied-anchor outbox-replied-msg">
      1 Reply | {record.createdTimestamp !== "-" ? <span className="clockIcon"> {_global.timeSince(parseInt(record.createdTimestamp)) + " ago."}</span> : null}
    </div>
    {record.attachments && record.attachments.length != 0  && showAttachment(record, downloadAttachment)}
    <div className="email-body cursor-text">
      {ReactHtmlParser(record.msgText && record.msgText.replace(/{{break}}/g, "<br />").replace(/\*\*(\S(.*?\S)?)\*\*/gm, "<strong>$1</strong>"))}
    </div>
  </div>
);

export const ExpandedRowInbox = ({ record, getText, activeTab, modalForReplyMsg, moveMessage, downloadAttachment }) => {
  return (
    <div className="email-wrapper inbox">
      {record.attachments && record.attachments.length != 0 && showAttachment(record, downloadAttachment)}
      <div className="email-body cursor-text">
        {ReactHtmlParser(record.message && record.message.replace(/{{break}}/g, "<br />").replace(/\*\*(\S(.*?\S)?)\*\*/gm, "<strong>$1</strong>"))}
      </div>
      {record.replyNotificationUuid ? null : (
        <div className="email-footer">
          <div className="left-align">
            <button
              className="btn btn-transparent btn-reply"
              onClick={() => {
                modalForReplyMsg(record);
              }}
            >
              <span className="icon icon-corner-up-left" />
              REPLY
            </button>
            <button onClick={getText} className="copy-to-clipboard">
              <i className="icon icon-copy-to-clipboard" />
              Copy to Clipboard
            </button>
          </div>

          <div className="right-align">
            <div className="move-message-container" onClick={() => moveMessage(record)}>
              <input type="checkbox" className="move-message-checkbox" />
              <i className={`icon icon-circle icon-circle-unchecked`} />
              <label className="move-message-label">Move to {activeTab === "complete" ? "inbox" : "complete"}</label>
            </div>
          </div>
        </div>
      )}

      {record.replyNotificationUuid ? (
        <React.Fragment>
          <div className="replied-anchor">
            1 Reply |{" "}
            {record.replyNotificationTimestamp !== "-" ? <span className="clockIcon"> {_global.timeSince(parseInt(record.replyNotificationTimestamp)) + " ago."}</span> : null}
          </div>
          <div className="email-body">{record.replyNotificationText}</div>
        </React.Fragment>
      ) : null}
    </div>
  );
};
