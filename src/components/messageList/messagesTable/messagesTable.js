import React, { Component } from 'react';
import { 
    Nav, 
    NavItem,
    NavLink,
    TabPane,
    TabContent,
    Button,
    FormGroup,
    Label,
    Input,
    Form,
    Container,
    Alert,
 } from 'reactstrap';
import classnames from 'classnames';
import Grid from './../../Grid';
import moment from 'moment';
import { _global } from './../../../helpers/global';
import ReactHtmlParser from 'react-html-parser';
import { ExpandedRowInbox, ExpandedRowOutbox } from './../expandedRows';
import { inboxGrid, completeGrid, outboxGrid, memberinboxGrid, membercompleteGrid, memberoutboxGrid } from './../data';
import {Loader} from './../../wrapper';

let tableHeight = null;
class MessageTable extends Component {
    state = {
        activeTab: 'inbox',
        expandedRowKeysArrayForInbox: [],
        expandedRowKeysArrayForOutbox: [],
        expandedRowKeysArrayForComplete: []
    }

   // handleExpandedRowRenderForOutbox = (record, key) => <ExpandedRowOutbox record={record} />

    handleExpandedRowRenderForOutbox = (record, key) => (
        <ExpandedRowOutbox
            record={record}
            getText= {() => _global.getText(record)}
            downloadAttachment={this.props.downloadAttachment}
       />
   )

    moveMessage = record => {
        this.setState({
            memberUuidComplete: record.memberUuid
        });
        let reqObj;
        if (this.state.activeTab == 'inbox') {
            reqObj = {
                messageId: record.messageId,
                //completeStatus: true
                replyRequired: false,
                completed: true
            };
        } else if (this.state.activeTab == 'complete') {
            reqObj = {
                messageId: record.messageId,
                //completeStatus: false
                replyRequired: true,
                completed: false
            };
        }

        this.props.updateMessages(reqObj);
    };

    getText = (e) => {
        let copyText,
            parentNode = e.target.parentNode.parentNode;

        if (
            parentNode &&
            parentNode.previousElementSibling &&
            parentNode.previousElementSibling.innerText
        ) {
            copyText = parentNode.previousElementSibling.innerText;
        } else {
            copyText = parentNode.parentNode.previousElementSibling.innerText;
        }
        let $tempInput = document.createElement('INPUT');
        document.body.appendChild($tempInput);
        $tempInput.setAttribute('value', copyText);
        $tempInput.select();
        document.execCommand('copy');
        document.body.removeChild($tempInput);
    };

    handleExpandedRowRenderForInbox = (record, key) => (
        <ExpandedRowInbox
            record={record}
            key={key}
            getText= {() => _global.getText(record)}
            activeTab={this.state.activeTab}
            modalForReplyMsg={this.props.modalForReplyMsg}
            moveMessage={this.moveMessage}
            downloadAttachment={this.props.downloadAttachment}
        />
    )

    showRelatedInfo = (record, tab) => {
        var lowerTab = tab.toLowerCase();
        this.setState({
            [lowerTab + 'MessageUuid']: record.messageId,
            ['expandedRowKeysArrayFor' + tab]: [record.messageId]
        });
    };

    handleClickRow = record => {
        if (record.messageId !== this.state.inboxMessageUuid) {
            this.setState({
                expandedRowKeysArrayForInbox: [],
                inboxMessageUuid: record.messageId,
            },
                function () {
                    this.showRelatedInfo(record, "Inbox");
                }
            );
        }
        if (record.messageId !== this.state.completeMessageUuid) {
            this.setState({
                expandedRowKeysArrayForComplete: [],
                completeMessageUuid: record.messageId
            },
                function () {
                    this.showRelatedInfo(record, "Complete");
                }
            );
        }
        if (record.messageId !== this.state.outboxMessageUuid) {
            this.setState({
                expandedRowKeysArrayForOutbox: [],
                outboxMessageUuid: record.messageId
            },
                function () {
                    this.showRelatedInfo(record, "Outbox");
                }
            );
        }
    };

    toggleTabs = tab => {
        if (tab === 'outbox') {
            this.setState({
                expandedRowKeysArrayForInbox: null,
                inboxMessageUuid: null
            });

            if(this.props.memberMessageFlag){
                this.props.getMemberOutboxMessages({ memberUuid:this.props.memberUuid });
            }
            else{
                this.props.getMemberOutboxMessages();
            }
        }

        if (tab === 'inbox') {
            this.setState({
                expandedRowKeysArrayForOutbox: null,
                outboxMessageUuid: null
            });

            if(this.props.memberMessageFlag){
                this.props.getInboxMessages({ messageFolder: 'inbox', memberUuid:this.props.memberUuid });
            }
            else{
                this.props.getInboxMessages({ messageFolder: 'inbox' });
            }
        }

        if (tab === 'complete') {
            this.setState({
                expandedRowKeysArrayForOutbox: null,
                outboxMessageUuid: null,
                expandedRowKeysArrayForInbox: null,
                outboxMessageUuid: null
            });
            if(this.props.memberMessageFlag){
                this.props.getMemberCompleteMessages({ messageFolder: 'complete', memberUuid:this.props.memberUuid });
            }
            else{
                this.props.getMemberCompleteMessages({ messageFolder: 'complete' });
            }
            
        }

        if (this.state.activeTab !== tab) {
            this.setState({
                activeTab: tab
            });
        }
    };

    hideAccordion = () => {
        if (this.state.activeTab == 'inbox') {
            this.setState({
                expandedRowKeysArrayForInbox: null,
                inboxMessageUuid: null
            });
        } else if (this.state.activeTab == 'complete') {
            this.setState({
                expandedRowKeysArrayForComplete: null,
                completeMessageUuid: null
            });
        } else if (this.state.activeTab == 'outbox') {
            this.setState({
                expandedRowKeysArrayForOutbox: null,
                outboxMessageUuid: null
            });
        }
    };

    handleColumnData = data => <div onClick={this.hideAccordion}>{data}</div>;
    
    render() {
        const { inboxData, completeData, outBoxTableData, memberMessageFlag } = this.props;
        let inboxGridJson = '';
        let completeGridJson = '';
        let gridJsonOutbox = '';

        if(memberMessageFlag) {
            inboxGridJson = memberinboxGrid(this.handleColumnData)
            completeGridJson = membercompleteGrid(this.handleColumnData)
            gridJsonOutbox = memberoutboxGrid(this.handleColumnData)
        }
        else{   
            inboxGridJson = inboxGrid(this.handleColumnData)
            completeGridJson = completeGrid(this.handleColumnData)
            gridJsonOutbox = outboxGrid(this.handleColumnData)
        }


        return (
            <div className="tab-container message-list messageList margin-top-30">
                <Nav tabs>
                    <NavItem key="inbox">
                        <NavLink
                            onClick={e => this.toggleTabs('inbox')}
                            onDragOver={e => this.onDragOver(e)}
                            onDrop={e => this.onDrop(e, 'inbox')}
                            className={classnames({
                                droppable: true,
                                active: this.state.activeTab === 'inbox',
                                tabStyle: true
                            })}
                        >
                            Inbox
                  </NavLink>
                    </NavItem>
                    <NavItem key="complete">
                        <NavLink
                            onClick={e => this.toggleTabs('complete')}
                            onDragOver={e => this.onDragOver(e)}
                            onDrop={e => this.onDrop(e, 'complete')}
                            className={classnames({
                                droppable: true,
                                active: this.state.activeTab === 'complete',
                                tabStyle: true
                            })}
                        >
                            Complete
                  </NavLink>
                    </NavItem>
                    <NavItem key="outbox">
                        <NavLink
                            onClick={e => this.toggleTabs('outbox')}
                            className={classnames({
                                active: this.state.activeTab === 'outbox',
                                tabStyle: true
                            })}
                        >
                            Sent
                  </NavLink>
                    </NavItem>
                </Nav>
                <TabContent activeTab={this.state.activeTab}>
                    <TabPane tabId="inbox">
                        <div className="table-responsive tab-page-container table-container member-tab message-list">
                            {inboxData ? (
                                <div>
                                    <Grid
                                        columns={inboxGridJson}
                                        data={inboxData}
                                        hoverable={false}
                                        justified={false}
                                        useFixedHeader={true}
                                        rowKey={record => record.messageId}
                                        onRowClick={this.handleClickRow}
                                        expandedRowRender={
                                            this.handleExpandedRowRenderForInbox
                                        }
                                        expandedRowKeys={
                                            this.state.expandedRowKeysArrayForInbox
                                        }
                                        clientSidePagination={true}
                                        dragStart={this.onDragStart}
                                        extraClass={'draggable-inbox'}
                                        activeTab={this.state.activeTab}
                                    />
                                </div>
                            ) : <Loader />}
                        </div>
                    </TabPane>
                    <TabPane tabId="complete">
                        <div className="table-responsive tab-page-container table-container member-tab message-list">
                            {completeData ? (
                                <Grid
                                    columns={completeGridJson}
                                    data={completeData}
                                    hoverable={false}
                                    justified={false}
                                    useFixedHeader={true}
                                    rowKey={record => record.messageId}
                                    onRowClick={this.handleClickRow}
                                    expandedRowRender={this.handleExpandedRowRenderForInbox}
                                    expandedRowKeys={
                                        this.state.expandedRowKeysArrayForComplete
                                    }
                                    clientSidePagination={true}
                                    dragStart={this.onDragStart}
                                    extraClass={'draggable-complete'}
                                    activeTab={this.state.activeTab}
                                />
                            ) : <Loader />}
                        </div>
                    </TabPane>
                    <TabPane tabId="outbox">
                        <div className="table-responsive tab-page-container table-container member-tab message-list">
                            {outBoxTableData ? (
                                <Grid columns={gridJsonOutbox}
                                    data={outBoxTableData}
                                    hoverable={false}
                                    justified={false}
                                    useFixedHeader={true}
                                    // maxHeight={tableHeight}
                                    rowKey={record => record.messageId}
                                    onRowClick={this.handleClickRow}
                                    expandedRowRender={this.handleExpandedRowRenderForOutbox}
                                    expandedRowKeys={this.state.expandedRowKeysArrayForOutbox}
                                    clientSidePagination={true}
                                    extraClass={''} />
                            ) : <Loader />}
                        </div>
                    </TabPane>
                </TabContent>
            </div>
        )
    }
}

export default MessageTable;