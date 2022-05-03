import React, { Component } from 'react';
import Table from '@trendmicro/react-table';
import { TablePagination } from '@trendmicro/react-paginations';
import '@trendmicro/react-table/dist/react-table.css';
import '@trendmicro/react-paginations/dist/react-paginations.css';
import './../assets/scss/grid.scss';

const sortBy = require('sort-by');

class Grid extends Component {
    constructor(props) {
      super(props);
  
      this.state = {
        tableData: this.props.data,
        displayData: this.props.data.slice(0, 9),
        pageCount: Math.ceil(this.props.data.length / 10),
        pagination: {
          page: 1,
          pageLength: 10
        },
        sortColumnKey: '',
        sortOrder: 'asc',
      };
    }
  
    componentWillReceiveProps(nextProps) {
      if (this.props.data !== nextProps.data) {
        this.setState({
          tableData: nextProps.data,
          displayData: nextProps.data.slice(0, 9)
        });
      }
      if (this.props.replyMsg) {
        if (this.props.replyMsg !== nextProps.replyMsg) {
          this.setState({ showRepliedMsg: nextProps.replyMsg });
        }
      }
    }
  
    /**
     * toggle sort order
     * @param {object} column
     * @param {boolean} clientSidePagination
     */
    toggleSortOrder = (column, clientSidePagination) => event => {
      let data = this.state.tableData;
      this.state.sortOrder === 'asc'
        ? data.sort(sortBy(column.key))
        : data.sort(sortBy('-' + column.key));
      this.setState({
        tableData: data,
        sortColumnKey: column.key,
        sortOrder: this.state.sortOrder === 'asc' ? 'desc' : 'asc'
      });
  
      if (clientSidePagination) {
        this.fetchRecords(
          this.state.pagination.page,
          this.state.pagination.pageLength
        );
      }
    };
  
    /**
     * feed in the correct set of columns which are sortable
     * to the table library
     * @param {object} columns
     * @param {boolean} clientSidePagination
     */
    sortableColumns = (columns, clientSidePagination) => {
      let columnArray = null;
      const { sortColumnKey, sortOrder } = this.state;
      columnArray = columns.map((column, index) => {
        if (column.sortable) {
          return {
            ...column,
            sortOrder: column.key === sortColumnKey ? sortOrder : '',
            onClick: this.toggleSortOrder(column, clientSidePagination)
          };
        } else {
          return column;
        }
      });
      return columnArray;
    };
  
    /**
     * filter the records based on the pagination criteria
     * @param {number} page
     * @param {number} pageLength
     */
    fetchRecords = (page, pageLength) => {
      const displayDataLastIndex = page * pageLength,
        diplayDataStartIndex = displayDataLastIndex - pageLength,
        displayData = this.state.tableData.slice(
          diplayDataStartIndex,
          displayDataLastIndex
        );
      this.setState({
        displayData: displayData,
        pagination: {
          page: page,
          pageLength: pageLength
        }
      });
    };

    handlePageClick = data => {
      this.props.collapseOpenRecords();
      let selected = data.selected + 1;
      this.fetchRecords(selected, this.state.pagination.pageLength);
    };
  
    /**
     * render to html
     * @param
     * @return
     */
    render() {
      const columnData = this.sortableColumns(
        this.props.columns,
        this.props.clientSidePagination
      );
      const { page, pageLength } = this.state.pagination;
      const totalRecords = this.state.tableData.length;

      
  
      return (
        <Table
          columns={columnData}
          data={
            this.props.clientSidePagination
              ? this.state.displayData
              : this.state.tableData
          }
          bordered={true}
          hoverable={this.props.hoverable}
          justified={this.props.justified}
          rowKey={this.props.rowKey}
          useFixedHeader={this.props.useFixedHeader}
          maxHeight={this.props.maxHeight ? this.props.maxHeight : null}
          rowClassName={ () =>  this.props.rowClassName ? this.props.rowClassName : 'table-row'}
          onRowClick={this.props.onRowClick ? this.props.onRowClick : () => {}}
          emptyText={() => 'No data found'}
          expandedRowRender={
            this.props.expandedRowRender ? this.props.expandedRowRender : () => {}
          }
          expandedRowKeys={
            this.props.expandedRowKeys ? this.props.expandedRowKeys : []
          }
          title={
            this.props.clientSidePagination ? (

              <div>
              <TablePagination
                page={page}
                pageLength={pageLength}
                totalRecords={totalRecords}
                onPageChange={({ page, pageLength }) => {
                  this.fetchRecords(page, pageLength);
                }}
                prevPageRenderer={() => <i className="icon icon-chevron-left" />}
                nextPageRenderer={() => <i className="icon icon-chevron-right" />}
                className="pagination-details"
              />
            </div>
            ) : null
          }
        />
      );
    }
  }
  
  export default Grid;