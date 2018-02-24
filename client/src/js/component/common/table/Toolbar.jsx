import React from 'react';
import PropTypes from 'prop-types';
import shortid from 'shortid';
import { trim } from 'lodash';
import { Menu, Menus, Dropdown, Icon } from '../../index';

class Toolbar extends React.Component {
  static propTypes = {
    hasRefresh: PropTypes.bool,
    hasColumnsControl: PropTypes.bool,
    hasSearch: PropTypes.bool,
    refresh: PropTypes.func,
    columns: PropTypes.array,
    columnControl: PropTypes.func,
    items: PropTypes.array,
    showFilter: PropTypes.bool,
    onSearch: PropTypes.func,
    onFilter: PropTypes.func,
  };

  static defaultProps = {
    hasRefresh: true,
    hasColumnsControl: true,
    hasSearch: true,
    showFilter: false,
    items: [],
    onSearch: () => {},
    onFilter: () => {},
  };

  constructor(props) {
    super(props);

    this.state = {
      columns: [],
      leftItems: [],
      rightItems: [],
      searched: false,
      search_word: '',
    };

    this.handleRefresh = this.handleRefresh.bind(this);
    this.handleColumnControl = this.handleColumnControl.bind(this);
    this.generateColumnControlBtn = this.generateColumnControlBtn.bind(this);
    this.handleSearchWordChange = this.handleSearchWordChange.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
    this.handleEnter = this.handleEnter.bind(this);
    this.handleClearSearch = this.handleClearSearch.bind(this);
    this.generateFilterBtn = this.generateFilterBtn.bind(this);
  }

  handleRefresh() {
    this.props.refresh();
  }

  handleColumnControl(item, index) {
    this.props.columnControl(item, index);
  }

  handleSearch() {
    if (!this.state.search_word) return;
    this.setState({ searched: true });
    this.props.onSearch(this.state.search_word);
  }

  handleEnter(e) {
    if (e.keyCode === 13) this.handleSearch();
  }

  handleClearSearch() {
    this.refs.searchInput.value = '';
    this.setState({ searched: false, search_word: '' });
    this.props.onSearch('');
  }

  handleSearchWordChange(e) {
    this.setState({ search_word: trim(e.target.value) });
  }

  generateColumnControlBtn() {
    const content = (
      <Menus>
        {this.props.columns.map((item, index) => {
          const icon = item.visible ? 'check' : 'remove';
          if (!item.isCheck && !item.isIndex && !item.isRadio) {
            return (
              <Menu
                key={item.label}
                icon={icon}
                onClick={() => this.handleColumnControl(item, index)}>
                {item.label}
              </Menu>
            );
          }
          return null;
        })}
      </Menus>
    );

    return (
      <div className="level-item">
        <Dropdown content={content} closeAfterClick={false}>
          <a className="button is-light">
            <Icon name="eye"/>
          </a>
        </Dropdown>
      </div>
    );
  }

  generateFilterBtn() {
    const filters = [];
    this.props.columns.forEach((item) => {
      if (item.filters && item.filters.length > 0) {
        const filterItem = {
          label: item.label,
          type: 'float',
          isSub: true,
          items: item.filters,
          field: item.field,
          onClick: item.onFilter || this.props.onFilter,
        };
        filters.push(filterItem);
      }
    });
    const menuArr = [{ items: filters }];
    const menus = menuArr.map(menu => (
      <Menus
        label={menu.label}
        key={menu.label || shortid.generate()}
        isSub={menu.isSub}
        icon={menu.icon}
        type={menu.type}
      >
        {menu.items.map(item => (item.isSub ? this.generateMenu(item) :
          <Menu onClick={item.onClick} icon={item.icon} key={item.label}>{item.label}</Menu>))}
      </Menus>
    ));

    return (
      <div className="level-item">
        <Dropdown content={<div className="menu">{menus}</div>}>
          <a className="button is-primary">
            <Icon name="filter"/>
          </a>
        </Dropdown>
      </div>
    );
  }

  generateMenu(menus) {
    if (!Array.isArray(menus)) menus = [menus];
    return menus.map(menu => (
      <Menus
        label={menu.label}
        key={menu.label || shortid.generate()}
        isSub={menu.isSub}
        icon={menu.icon}
        type="float"
        onClick={menu.onFilter || this.props.onFilter}
      >
        {menu.items.map(item => (item.isSub ? this.generateMenu(item) :
          <Menu
            icon={item.icon}
            key={item.label}
            onClick={() => menu.onClick(menu.field, item.value)}
          >
            {item.label}
          </Menu>
        ))}
      </Menus>
    ));
  }

  componentWillReceiveProps(nextProps) {
    this.state.columns = this.props.columns;
    if (this.state.columns.length === 0) {
      this.setState({
        columns: nextProps.columns,
        // items: nextProps.items,
      });
    }
  }

  render() {
    const { items, hasSearch, hasRefresh, hasColumnsControl, showFilter } = this.props;
    const leftItems = [];
    const rightItems = [];

    items.forEach(item => {
      if (Object.prototype.hasOwnProperty.call(item, 'content')) {
        item.align === 'right' ? rightItems.push(item.content) : leftItems.push(item.content);
      } else {
        leftItems.push(item);
      }
    });

    const searchEl = hasSearch ? (
      <div className="level-item toolbar-search">
        <div className="control has-icon has-icon-right">
          <input
            className="input" type="text"
            ref="searchInput"
            placeholder="搜索"
            onKeyDown={this.handleEnter}
            onChange={this.handleSearchWordChange}
          />
          {this.state.searched ? (
            <span className="icon is-small is-right" onClick={this.handleClearSearch}>
              <Icon name="remove"/>
            </span>
          ) : (
            <span className="icon is-small is-right" onClick={this.handleSearch}>
              <Icon name="search"/>
            </span>
          )}
        </div>
      </div>
    ) : null;

    const refreshBtn = hasRefresh ? (
      <div className="level-item">
        <a className="button is-light" onClick={this.handleRefresh}>
          <Icon name="refresh"/>
        </a>
      </div>
    ) : null;

    const columnsControlBtn = hasColumnsControl ? this.generateColumnControlBtn() : null;
    const filterBtn = showFilter ? this.generateFilterBtn() : null;

    return (
      <div className="table-toolbar level">
        <div className="level-left">
          {leftItems.map((item, index) => <div className="level-item" key={index}>{item}</div>)}
        </div>
        <div className="level-right">
          {rightItems.map((item, index) => <div className="level-item" key={index}>{item}</div>)}
          {filterBtn}
          {searchEl}
          {refreshBtn}
          {columnsControlBtn}
        </div>
      </div>
    );
  }
}

export default Toolbar;
