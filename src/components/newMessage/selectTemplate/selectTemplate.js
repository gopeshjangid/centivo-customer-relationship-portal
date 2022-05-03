import React, { Component } from 'react';
import {Row, Col, Label, Input} from 'reactstrap';
import DatePicker from 'react-datepicker';

const SelectTemplate = ({messageType, templateList, selectTemplateHandler, startDate, currentDate, handleChangeStart}) => (
            <div className="message-box">
                <div className="message-header">Message</div>
                <Row className="message-form-wrapper">
                    <Col md={6}>
                        <Label className="text-teal">Template</Label>
                        <div className="form-field-wrapper">
                            <div className="select-wrapper">
                                <Input
                                    type="select"
                                    name="email"
                                    onChange={e => selectTemplateHandler(e)}
                                >
                                    <option value="-1">Select Template</option>
                                    {templateList &&
                                        templateList.map(
                                            (template, index) => (
                                                <option
                                                    key={template.masterMsgTemplateUuid}
                                                    index={index}
                                                    mastermsgtemplateuuid={
                                                        template.masterMsgTemplateUuid
                                                    }
                                                >
                                                    {template.templateName}
                                                </option>
                                            )
                                        )}
                                </Input>
                            </div>
                        </div>
                        {messageType.isTemplateSelected && (
                            <>
                                <div className="form-field-wrapper">
                                    <Label className="text-teal padding-left-0">Description</Label>
                                    <Input
                                        type="text"
                                        name="Description"
                                        id="Description"
                                        value={
                                            messageType.isTemplateSelected &&
                                            messageType.description
                                        }
                                        readOnly
                                    />
                                </div>
                                <div className="form-field-wrapper">
                                <Label className="display-block text-teal padding-left-0">
                                    Start Date
                                </Label>
                                    <Label>
                                        <DatePicker
                                            selected={startDate}
                                            minDate={currentDate}
                                            dateFormat="mm/dd/yyyy h:mm a"
                                            showTimeSelect
                                            // showMonthDropdown
                                            // showYearDropdown
                                            className="form-control left-border-radius-0"
                                            onChange={handleChangeStart}
                                        />
                                        <i className="icon icon-calendar" />
                                    </Label>
                                </div>
                            </>
                        )}
                    </Col>
                </Row>
            </div>
        )


export default SelectTemplate;