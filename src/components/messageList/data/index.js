import React from "react";
import { _global } from "./../../../helpers/global";
import moment from "moment";
import AttachmentIcon from "../../../assets/icons/components/AttachmentIcon";

export const inboxGrid = (handleColumnData) => [
  {
    sortable: true,
    enableServerSideSorting: false,
    title: "Date",
    key: "transactionDate",
    //width: 150,
    width: "auto",
    headerClassName: "table-header-style",
    render: (value, row, index) => {
      return handleColumnData(_global.formatDateString(row.transactionDate));
    },
  },
  {
    sortable: false,
    enableServerSideSorting: false,
    title: "",
    //width: '3%',
    width: "auto",
    key: "attachments",
    headerClassName: "table-header-style",
    render: (value, row, index) => {
      // console.log(row)
      return row.attachments && row.attachments.length ? handleColumnData(<AttachmentIcon />) : handleColumnData("");
    },
  },
  {
    title: "Member Name",
    key: "memberName",
    //width: 250,
    width: "auto",
    headerClassName: "table-header-style",
    render: (value, row, index) => {
      const memberName = row.recipientFirstName + " " + row.recipientLastName;
      return handleColumnData(_global.formatCapitalization(memberName));
    },
  },
  {
    title: "Member ID",
    key: "recipientFamilyId",
    //width: 200,
    width: "auto",
    headerClassName: "table-header-style",
    render: (value, row, index) => {
      if (row.recipientFamilyId) {
        return handleColumnData(row.recipientFamilyId);
      } else {
        return handleColumnData("-");
      }
    },
  },
  {
    title: "Member Email",
    key: "email",
    headerClassName: "table-header-style",
    //width: 350,
    width: "auto",
    render: (value, row, index) => {
      return handleColumnData(row.email);
    },
  },
  {
    title: "Phone",
    key: "primaryPhone",
    //width: 200,
    width: "auto",
    headerClassName: "table-header-style header-phone",
    render: (value, row, index) => {
      return handleColumnData(row.primaryPhone);
    },
  },
  {
    title: "Subject",
    key: "subject",
    headerClassName: "table-header-style",
    //width: 520,
    width: "auto",
    render: (value, row, index) => {
      return handleColumnData(row.subject.length > 50 ? row.subject.substr(0, 50) + "..." : row.subject);
    },
  },
];

export const completeGrid = (handleColumnData) => [
  {
    sortable: true,
    enableServerSideSorting: false,
    title: "Date",
    key: "transactionDate",
    //width: 150,
    width: "auto",
    headerClassName: "table-header-style",
    render: (value, row, index) => {
      return handleColumnData(_global.formatDateString(row.transactionDate));
    },
  },
  {
    sortable: false,
    enableServerSideSorting: false,
    title: "",
    //width: '3%',
    width: "auto",
    key: "attachments",
    headerClassName: "table-header-style",
    render: (value, row, index) => {
      // console.log(row)
      return row.attachments && row.attachments.length ? handleColumnData(<AttachmentIcon />) : handleColumnData("");
    },
  },
  {
    title: "Member Name",
    key: "memberName",
    //width: 250,
    width: "auto",
    headerClassName: "table-header-style",
    render: (value, row, index) => {
      const memberName = row.recipientFirstName + " " + row.recipientLastName;
      return handleColumnData(_global.formatCapitalization(memberName));
    },
  },
  {
    title: "Member ID",
    key: "recipientFamilyId",
    //width: 200,
    width: "auto",
    headerClassName: "table-header-style",
    render: (value, row, index) => {
      if (row.recipientFamilyId) {
        return handleColumnData(row.recipientFamilyId);
      } else {
        return handleColumnData("-");
      }
    },
  },
  {
    title: "Member Email",
    key: "email",
    headerClassName: "table-header-style",
    //width: 350,
    width: "auto",
    render: (value, row, index) => {
      return handleColumnData(row.email);
    },
  },
  {
    title: "Phone",
    key: "primaryPhone",
    //width: 200,
    width: "auto",
    headerClassName: "table-header-style header-phone",
    render: (value, row, index) => {
      return handleColumnData(row.primaryPhone);
    },
  },
  {
    title: "Subject",
    key: "subject",
    headerClassName: "table-header-style",
    //width: 520,
    width: "auto",
    render: (value, row, index) => {
      return handleColumnData(row.subject.length > 50 ? row.subject.substr(0, 50) + "..." : row.subject);
    },
  },
];

export const outboxGrid = (handleColumnData) => [
  {
    sortable: true,
    enableServerSideSorting: false,
    title: "Date",
    //width: '10%',
    width: "auto",
    key: "createdTimestamp",
    headerClassName: "table-header-style",
    render: (value, row, index) => {
      return row.createdTimestamp ? handleColumnData(moment(new Date(parseInt(row.createdTimestamp))).format("L")) : handleColumnData("-");
    },
  },
  {
    sortable: false,
    enableServerSideSorting: false,
    title: "",
    //width: '3%',
    width: "auto",
    key: "attachments",
    headerClassName: "table-header-style",
    render: (value, row, index) => {
      // console.log(row)
      return row.attachments && row.attachments.length ? handleColumnData(<AttachmentIcon />) : handleColumnData("");
    },
  },
  {
    sortable: true,
    enableServerSideSorting: false,
    title: "Subject",
    key: "msgSubject",
    headerClassName: "table-header-style",
    render: (value, row, index) => {
      return row.msgSubject ? handleColumnData(row.msgSubject) : handleColumnData("-");
    },
  },
  {
    sortable: false,
    enableServerSideSorting: false,
    title: "Message",
    key: "msgText",
    headerClassName: "table-header-style",
    render: (value, row, index) => {
      return row.msgText ? handleColumnData(row.msgText) : handleColumnData("-");
    },
  },
  {
    sortable: true,
    enableServerSideSorting: false,
    title: "Message Type",
    key: "msgType",
    headerClassName: "table-header-style",
    render: (value, row, index) => {
      return row.msgType ? handleColumnData(row.msgType) : handleColumnData("-");
    },
  },
];

export const memberinboxGrid = (handleColumnData) => [
  {
    sortable: true,
    enableServerSideSorting: false,
    title: "Date",
    key: "transactionDate",
    //width: 150,
    width: "auto",
    headerClassName: "table-header-style",
    render: (value, row, index) => {
      return handleColumnData(_global.formatDateString(row.transactionDate));
    },
  },
  {
    sortable: false,
    enableServerSideSorting: false,
    title: "",
    //width: '3%',
    width: "auto",
    key: "attachments",
    headerClassName: "table-header-style",
    render: (value, row, index) => {
      // console.log(row)
      return row.attachments && row.attachments.length ? handleColumnData(<AttachmentIcon />) : handleColumnData("");
    },
  },
  {
    title: "Member Name",
    key: "memberName",
    //width: 250,
    width: "auto",
    headerClassName: "table-header-style",
    render: (value, row, index) => {
      const memberName = row.recipientFirstName + " " + row.recipientLastName;
      return handleColumnData(_global.formatCapitalization(memberName));
    },
  },
  {
    title: "Member ID",
    key: "recipientFamilyId",
    //width: 200,
    width: "auto",
    headerClassName: "table-header-style",
    render: (value, row, index) => {
      return handleColumnData(row.recipientFamilyId);
    },
  },
  {
    title: "Member Email",
    key: "email",
    //width: 350,
    width: "auto",
    headerClassName: "table-header-style",
    render: (value, row, index) => {
      return handleColumnData(row.email);
    },
  },
  {
    title: "Phone",
    key: "primaryPhone",
    //width: 200,
    width: "auto",
    headerClassName: "table-header-style",
    render: (value, row, index) => {
      return handleColumnData(_global.formatPhoneNumber(row.primaryPhone));
    },
  },
  {
    title: "Subject",
    key: "subject",
    //width: 520,
    width: "auto",
    headerClassName: "table-header-style",
    render: (value, row, index) => {
      return handleColumnData(row.subject);
    },
  },
];

export const membercompleteGrid = (handleColumnData) => [
  {
    sortable: true,
    enableServerSideSorting: false,
    title: "Date",
    key: "transactionDate",
    //width: 150,
    width: "auto",
    headerClassName: "table-header-style",
    render: (value, row, index) => {
      return handleColumnData(_global.formatDateString(row.transactionDate));
    },
  },
  {
    sortable: false,
    enableServerSideSorting: false,
    title: "",
    //width: '3%',
    width: "auto",
    key: "attachments",
    headerClassName: "table-header-style",
    render: (value, row, index) => {
      // console.log(row)
      return row.attachments && row.attachments.length ? handleColumnData(<AttachmentIcon />) : handleColumnData("");
    },
  },
  {
    title: "Member Name",
    key: "memberName",
    //width: 250,
    width: "auto",
    headerClassName: "table-header-style",
    render: (value, row, index) => {
      const memberName = row.recipientFirstName + " " + row.recipientLastName;
      return handleColumnData(_global.formatCapitalization(memberName));
    },
  },
  {
    title: "Member ID",
    key: "recipientFamilyId",
    //width: 200,
    width: "auto",
    headerClassName: "table-header-style",
    render: (value, row, index) => {
      return handleColumnData(row.recipientFamilyId);
    },
  },
  {
    title: "Member Email",
    key: "email",
    //width: 350,
    width: "auto",
    headerClassName: "table-header-style",
    render: (value, row, index) => {
      return handleColumnData(row.email);
    },
  },
  {
    title: "Phone",
    key: "primaryPhone",
    //width: 200,
    width: "auto",
    headerClassName: "table-header-style",
    render: (value, row, index) => {
      return handleColumnData(row.primaryPhone);
    },
  },
  {
    title: "Subject",
    key: "subject",
    //width: 520,
    width: "auto",
    headerClassName: "table-header-style",
    render: (value, row, index) => {
      return handleColumnData(row.subject.length > 50 ? row.subject.substr(0, 50) + "..." : row.subject);
    },
  },
];

export const memberoutboxGrid = (handleColumnData) => [
  {
    sortable: true,
    enableServerSideSorting: false,
    title: "Date",
    key: "createdTimestamp",
    //width: 150,
    width: "auto",
    headerClassName: "table-header-style",
    render: (value, row, index) => {
      return row.createdTimestamp ? handleColumnData(moment(new Date(parseInt(row.createdTimestamp))).format("L")) : "-";
    },
  },
  {
    sortable: false,
    enableServerSideSorting: false,
    title: "",
    //width: '3%',
    width: "auto",
    key: "attachments",
    headerClassName: "table-header-style",
    render: (value, row, index) => {
      // console.log(row)
      return row.attachments && row.attachments.length ? handleColumnData(<AttachmentIcon />) : handleColumnData("");
    },
  },
  {
    sortable: true,
    enableServerSideSorting: false,
    title: "Read Date",
    key: "readTimestamp",
    //width: 150,
    width: "auto",
    headerClassName: "table-header-style",
    render: (value, row, index) => {
      return row.readTimestamp ? handleColumnData(row.readTimestamp) : "-";
    },
  },
  {
    title: "Member Name",
    key: "memberName",
    //width: 200,
    width: "auto",
    headerClassName: "table-header-style",
    render: (value, row, index) => {
      const memberName = row.recipientFirstName + " " + row.recipientLastName;
      return handleColumnData(_global.formatCapitalization(memberName));
    },
  },
  {
    title: "Family ID",
    key: "familyId",
    //width: 150,
    width: "auto",
    headerClassName: "table-header-style",
    render: (value, row, index) => {
      return row.recipientFamilyId ? handleColumnData(row.recipientFamilyId) : "-";
    },
  },
  {
    title: "Sensitivity",
    key: "sensitive",
    //width: 100,
    width: "auto",
    headerClassName: "table-header-style",
    render: (value, row, index) => {
      return row.sensitive ? handleColumnData(row.sensitive) : "-";
    },
  },
  {
    title: "Template Name",
    key: "templateName",
    className: "templateName",
    //width: 200,
    width: "auto",
    headerClassName: "table-header-style",
    render: (value, row, index) => {
      let templateNameUri;
      Object.keys(row).forEach((item) => {
        if (item.includes("#")) templateNameUri = row[item].split("#")[2];
      });
      return templateNameUri ? handleColumnData(templateNameUri) : "-";
    },
  },
];
