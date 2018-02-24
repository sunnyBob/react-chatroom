import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import isFunction from 'lodash/isFunction';
import sortBy from 'lodash/sortBy';
import isEqual from 'lodash/isEqual';

import Tag from '../tag';
import Pagination from '../pagination';
import TableHeader from './TableHeader';
import TableBody from './TableBody';
import Toolbar from './Toolbar';

class Table extends React.Component {
  static propTypes = {
    data: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
    columns: PropTypes.array,
    onChange: PropTypes.func,
    height: PropTypes.number,
    hasCheckbox: PropTypes.bool,
    checkable: PropTypes.func,
    hasRadio: PropTypes.bool,
    showIndex: PropTypes.bool,
    bordered: PropTypes.bool,
    striped: PropTypes.bool,
    narrow: PropTypes.bool,
    pagination: PropTypes.object,
    rowClassName: PropTypes.func,
    rowKey: PropTypes.string,
    onCheckedChange: PropTypes.func,
    onRowClick: PropTypes.func,
    onFilter: PropTypes.func,
    showTagFilters: PropTypes.bool,
    sorter: PropTypes.func,
    showToolbar: PropTypes.bool,
    toolbar: PropTypes.object,
    noDataText: PropTypes.any,
    loading: PropTypes.bool,
    className: PropTypes.string,
    responsive: PropTypes.bool,
    reverse: PropTypes.bool,
  };

  static defaultProps = {
    pagination: { current: 1 },
    onCheckedChange: () => {},
    noDataText: 'no data',
    showTagFilters: true,
    onFilter: () => {},
    onChange: () => {},
  };

  constructor(props) {
    super(props);

    this.state = {
      cols: [],
      sortState: {
        sortKey: '',
        reverse: props.reverse,
      },
      pagination: {},
      data: [],
      showData: [],
      selectedRows: [],
      selectedRowKeys: [],
      filters: [],
    };

    this.handleInitColumns = this.handleInitColumns.bind(this);
    this.handleToggleSort = this.handleToggleSort.bind(this);
    this.handleReorganizeData = this.handleReorganizeData.bind(this);
    this.handleTableChange = this.handleTableChange.bind(this);
    this.handlePageChange = this.handlePageChange.bind(this);
    this.handleCheckChange = this.handleCheckChange.bind(this);
    this.handleToggleCheckAll = this.handleToggleCheckAll.bind(this);
    this.getIsCheckAll = this.getIsCheckAll.bind(this);
    this.handleColumnControl = this.handleColumnControl.bind(this);
    this.onFilter = this.onFilter.bind(this);
  }

  handleInitColumns(data) {
    const columns = data || this.props.columns;
    const node = ReactDOM.findDOMNode(this);
    let width = node.offsetWidth;
    let length = columns.length;
    const cols = [];
    let column = {};

    if (this.props.hasCheckbox || this.props.hasRadio) {
      column.width = 40;
      if (this.props.hasCheckbox) {
        column.isCheck = true;
      } else {
        column.isRadio = true;
      }
      column.visible = true;
      width -= 40;
      cols.push(column);
    }

    if (this.props.showIndex) {
      column = {};
      column.width = 40;
      column.isIndex = true;
      column.visible = true;
      width -= 40;
      cols.push(column);
    }

    columns.forEach(col => {
      if (col.width) {
        width -= col.width;
        length -= 1;
      }
    });
    const avgWidth = Math.floor(width / length);

    columns.forEach(col => {
      if (!col.width) {
        const columnWidth = this.props.height ? avgWidth : '';
        col.width = columnWidth;
      }
      if (typeof col.visible === 'undefined') col.visible = true;
      cols.push(col);
    });

    this.setState({ cols });
  }

  handleReorganizeData() {
    if (this.state.pagination.total) {
      const current = this.state.pagination.current || 1;
      const pageSize = this.state.pagination.pageSize || 10;

      if (this.state.data.length <= pageSize) {
        this.setState({
          showData: this.state.data,
        });
      } else {
        const start = (current - 1) * pageSize;
        const end = parseInt(start, 10) + parseInt(pageSize, 10);
        const showData = this.state.data.slice(start, end);
        this.setState({
          showData,
        });
      }
    } else {
      this.setState({
        showData: this.state.data,
      });
    }
  }

  handleToggleSort(column) {
    if (!column.sorter || !column.field) return;
    const sortState = {
      sortKey: column.field,
      reverse: !this.state.sortState.reverse,
    };
    if (isFunction(column.sorter)) {
      this.state.data = column.sorter(this.state.data, column.field);
      if (sortState.reverse) this.state.data.reverse();
    } else if (column.sorter === 'custom') {
      this.state.data = sortBy(this.state.data, column.field);
      if (sortState.reverse) this.state.data.reverse();
    } else {
      this.props.sorter && this.props.sorter(column.field, sortState.reverse);
    }
    this.setState({ sortState }, this.handleTableChange());
  }

  handleTableChange() {
    const state = {
      sortKey: this.state.sortState.sortKey,
      reverse: this.state.sortState.reverse,
      pagination: this.state.pagination,
    };
    this.props.onChange(state);
    this.handleReorganizeData();
  }

  handlePageChange(current) {
    this.state.pagination.current = current;
    const onPageChange = this.state.pagination.onChange;
    if (onPageChange && isFunction(onPageChange)) {
      onPageChange(current);
    }
    this.handleTableChange();
  }

  handleCheckChange(isChecked, row) {
    const key = row[this.props.rowKey];
    const isExist = this.state.selectedRowKeys.indexOf(key) >= 0;
    const selectedRows = this.state.selectedRows;
    const selectedRowKeys = this.state.selectedRowKeys;

    if (this.props.hasRadio) {
      selectedRows.splice(0, selectedRows.length);
      selectedRowKeys.splice(0, selectedRowKeys.length);
      if (isChecked) {
        selectedRowKeys.push(key);
        selectedRows.push(row);
      }
    } else {
      if (isChecked && !isExist) {
        selectedRowKeys.push(key);
        selectedRows.push(row);
      }

      if (!isChecked && isExist) {
        const checkedIndex = this.state.selectedRowKeys.indexOf(key);
        selectedRows.splice(checkedIndex, 1);
        selectedRowKeys.splice(checkedIndex, 1);
      }
    }

    this.setState({
      selectedRows,
      selectedRowKeys,
    });
    this.props.onCheckedChange(this.state.selectedRowKeys, this.state.selectedRows);
  }

  handleToggleCheckAll(isCheck) {
    const selectedRows = this.state.selectedRows;
    const selectedRowKeys = this.state.selectedRowKeys;
    const checkable = this.props.checkable;

    this.state.showData.forEach(row => {
      const key = row[this.props.rowKey];
      const checkedIndex = this.state.selectedRowKeys.indexOf(key);
      const isExist = checkedIndex >= 0;
      const isDisabled = isFunction(checkable) ? checkable(row) : false;

      if (isCheck && !isExist && !isDisabled) {
        selectedRows.push(row);
        selectedRowKeys.push(key);
      } else if (!isCheck && isExist) {
        selectedRows.splice(checkedIndex, 1);
        selectedRowKeys.splice(checkedIndex, 1);
      }
    });

    this.setState({
      selectedRows,
      selectedRowKeys,
    });
    this.props.onCheckedChange(this.state.selectedRowKeys, this.state.selectedRows);
  }

  getIsCheckAll() {
    if (this.state.selectedRowKeys.length < 1) return false;
    const checkable = this.props.checkable;
    const checkAll = this.state.showData.some(row => {
      const key = row[this.props.rowKey];
      const isDisabled = isFunction(checkable) ? checkable(row) : false;
      return this.state.selectedRowKeys.indexOf(key) < 0 && !isDisabled;
    });

    return !checkAll && this.state.selectedRowKeys.length > 0;
  }

  handleColumnControl(item, index) {
    const cols = this.state.cols;
    cols[index].visible = !cols[index].visible;
    this.setState({ cols });
  }

  onFilter(filters) {
    this.setState({ filters }, this.props.onFilter(filters));
  }

  removeFilter(filter, key) {
    this.header.removeFilter(filter, key);
  }

  componentWillMount() {
    this.state.pagination = this.props.pagination;
    this.state.data = this.props.data || [];
    this.handleReorganizeData();
  }

  componentWillReceiveProps(nextProps) {
    if (!isEqual(nextProps.columns, this.props.columns)) {
      this.handleInitColumns(nextProps.columns);
    }
    if (!isEqual(nextProps.pagination, this.props.pagination)) {
      this.state.pagination = nextProps.pagination;
    }
    this.state.data = nextProps.data;
    this.handleReorganizeData();
  }

  componentDidMount() {
    this.handleInitColumns();
  }

  render() {
    const {
      bordered,
      striped,
      narrow,
      height,
      hasCheckbox,
      hasRadio,
      checkable,
      showIndex,
      rowClassName,
      rowKey,
      showToolbar,
      toolbar,
      noDataText,
      loading,
      onRowClick,
      className,
      responsive,
      showTagFilters,
    } = this.props;
    const paginationConfig = this.state.pagination;
    const filters = this.state.filters;
    const filterKeys = Object.keys(filters) || [];
    const tableStyle = height ? { height: `${height}px`, overflow: 'scroll' } : null;

    return (
      <div className="data-table-container">
        {loading ? (
          <div className="spinner">
            <div className="bounce1"></div>
            <div className="bounce2"></div>
            <div className="bounce3"></div>
          </div>
        ) : null}
        {showToolbar
          ? <Toolbar {...toolbar} columnControl={this.handleColumnControl} columns={this.state.cols} />
          : null
        }
        {this.props.children}
        {showTagFilters
          ? (
            <div className="filter-bar">{filterKeys.map(key => {
              const filter = filters[key];
              if (filter.value.length < 1) return null;
              const tags = filter.value.map(item =>
                <Tag
                  key={item.value}
                  size="medium"
                  closable
                  onClose={() => this.removeFilter(item, key)}
                >{item.label}</Tag>);
              return (
                <div className="filter-wrap" key={key}>{filter.label}: {tags}</div>
              );
            })}</div>
          )
          : null}
        <div
          className={classNames('data-table-main', { 'is-responsive': responsive })}
          style={tableStyle}
        >
          <table className={classNames('table data-table', {
            'is-bordered': bordered,
            'is-striped': striped,
            'is-narrow': narrow,
          }, className)}>
            <colgroup>
              {this.state.cols.map((col, index) => <col width={col.width} key={`cols-${index}`}/>)}
            </colgroup>
            {height ? null :
              <TableHeader
                ref={header => { this.header = header; }}
                hasCheckbox={hasCheckbox}
                hasRadio={hasRadio}
                sortState={this.state.sortState}
                columns={this.state.cols}
                showIndex={showIndex}
                toggleSort={this.handleToggleSort}
                toggleCheckAll={this.handleToggleCheckAll}
                getIsCheckAll={this.getIsCheckAll}
                onFilter={this.onFilter}
                currentPage={this.state.pagination.current}
              />
            }
            <TableBody
              data={this.state.showData}
              columns={this.state.cols}
              rowClassName={rowClassName}
              onCheckChange={this.handleCheckChange}
              checkable={checkable}
              onRowClick={onRowClick}
              rowKey={rowKey}
              selectedRowKeys={this.state.selectedRowKeys}
            />
          </table>
        </div>
        {!this.state.showData.length > 0 ? (
          <div className="no-data has-text-centered">{noDataText}</div>
        ) : null}
        {this.state.pagination['total'] && paginationConfig.isShow ?
          <Pagination {...paginationConfig} onChange={this.handlePageChange}/> : null}
      </div>
    );
  }
}

export default Table;
