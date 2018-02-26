import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { findIndex } from 'lodash';
import { Menu, Menus, Dropdown, Icon, Checkbox } from '../index';

class TableHeader extends React.Component {
  static propTypes = {
    columns: PropTypes.array,
    hasCheckbox: PropTypes.bool,
    hasRadio: PropTypes.bool,
    showIndex: PropTypes.bool,
    toggleSort: PropTypes.func,
    sortState: PropTypes.object,
    toggleCheckAll: PropTypes.func,
    selectedRowKeys: PropTypes.array,
    getIsCheckAll: PropTypes.func,
    onFilter: PropTypes.func,
    currentPage: PropTypes.number,
  };

  constructor(props) {
    super(props);

    const isCheckAll = props.getIsCheckAll();
    this.state = {
      selectedFilters: {}, // { key1: [ value1, value2 ], key2: }
      currentPage: props.currentPage || 1,
      isCheckAll,
    };
    this.handleToggleCheckAll = this.handleToggleCheckAll.bind(this);
    this.removeFilter = this.removeFilter.bind(this);
  }

  handleToggleCheckAll() {
    const isChecked = !this.state.isCheckAll;
    this.props.toggleCheckAll(isChecked);
  }

  handleClickFilter(filter, column) {
    // window.scroll(0, 1);
    const selectedFilters = this.state.selectedFilters;
    const selectedFilter = selectedFilters[column.field] || {};
    const index = findIndex(selectedFilter.value, filter);
    if (index > -1) {
      selectedFilter.value.splice(index, 1);
    } else {
      selectedFilter.value = selectedFilter.value || [];
      if (!column.filterMultiple) selectedFilter.value.length = 0;
      selectedFilter.label = column.label;
      selectedFilter.value.push(filter);
    }
    selectedFilters[column.field] = selectedFilter;
    this.setState({ selectedFilters }, this.props.onFilter(selectedFilters));
  }

  removeFilter(filter, field) {
    const selectedFilters = this.state.selectedFilters;
    const selectedFilter = selectedFilters[field] || {};
    const index = findIndex(selectedFilter.value, filter);
    if (index > -1) {
      selectedFilter.value.splice(index, 1);
      selectedFilters[field] = selectedFilter;
      this.setState({ selectedFilters }, this.props.onFilter(selectedFilters));
    }
  }

  genFilter(column) {
    const menus = column.filters.map(filter => {
      const selectedFilter = this.state.selectedFilters[column.field] || {};
      const isSelected = findIndex(selectedFilter.value, filter) > -1;
      const icon = isSelected ? 'check' : 'square-o';
      return (
        <Menu
          key={filter.value}
          icon={icon}
          onClick={() => this.handleClickFilter(filter, column)}
        >{filter.label}</Menu>
      );
    });
    const content = <Menus className="filter-menu">{menus}</Menus>;
    return (
      <Dropdown content={content}>
        <Icon name="filter"/>
      </Dropdown>
    );
  }

  // componentWillMount() {
  //   this.setState({ currentPage: this.props.currentPage });
  //   const isCheckAll = this.props.getIsCheckAll();
  //   this.setState({ isCheckAll });
  // }

  componentWillReceiveProps(nextProps) {
    this.setState({ currentPage: nextProps.currentPage });
    if (this.props.hasCheckbox) {
      const isCheckAll = this.props.getIsCheckAll();
      this.setState({ isCheckAll });
    }
  }

  render() {
    const {
      columns,
      // checkable,
      // showIndex,
      toggleSort,
      sortState,
      currentPage,
    } = this.props;

    return (
      <thead>
        <tr key={`header-${this.state.currentPage}`}>
          {columns.map((column, index) => {
            if (!column.visible) return null;
            if (column.isCheck) {
              return (
                <th key={`check-${currentPage}`} className="table-check">
                  <Checkbox checked={this.state.isCheckAll} onChange={this.handleToggleCheckAll}/>
                </th>
              );
            }
            if (column.isIndex) {
              return <th key={`index-${currentPage}`}>#</th>;
            }

            let sorterEl = '';
            let sortClass = 'sort';
            if (column.sorter) {
              if (sortState.sortKey === column.field && sortState.reverse) {
                sortClass = 'sort-desc';
              } else if (sortState.sortKey === column.field && !sortState.reverse) {
                sortClass = 'sort-asc';
              }

              sorterEl = (
                <span className={classNames('sort-trigger', { [sortClass]: true })}>
                  <i className={`fa fa-${sortClass}`}></i>
                </span>
              );
            }
            return (
              <th
                key={index} // todo
                className={classNames({ sortable: column.sorter })}
                onClick={toggleSort.bind(this, column)}
              >
                <span>{column.label}</span>
                {sorterEl}
                {column.filters && this.genFilter(column)}
              </th>
            );
          })}
        </tr>
      </thead>
    );
  }
}

export default TableHeader;
