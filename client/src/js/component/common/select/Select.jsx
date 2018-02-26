import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { findIndex, find, isEqual, trim, filter, isFunction, cloneDeep } from 'lodash';
import { Dropdown, Tag, Icon } from '../';

class Select extends React.Component {
  static propTypes = {
    wrapperClassName: PropTypes.string,
    className: PropTypes.string,
    name: PropTypes.string,
    onChange: PropTypes.func,
    value: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.string,
      PropTypes.array,
    ]),
    placeholder: PropTypes.string,
    fieldAttributes: PropTypes.shape({}),
    multiple: PropTypes.bool,
    options: PropTypes.array,
    selectedOptions: PropTypes.array,
    size: PropTypes.string,
    readOnly: PropTypes.bool,
    firstAsDefault: PropTypes.bool,
    hasSearch: PropTypes.bool,
    onSearch: PropTypes.func,
    appendix: PropTypes.oneOfType([
      PropTypes.node,
      PropTypes.element,
      PropTypes.string,
    ]),
  };

  static defaultProps = {
    onChange: () => {},
    options: [],
  };

  constructor(props) {
    super(props);

    const value = this.getInitValue();
    this.state = {
      value,
      options: props.options,
      selectedOptions: cloneDeep(props.selectedOptions),
    };

    this.renderOptions = this.renderOptions.bind(this);
    this.handleOnChange = this.handleOnChange.bind(this);
    this.renderSelected = this.renderSelected.bind(this);
    this.handleSearchWordChange = this.handleSearchWordChange.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
    this.handleEnter = this.handleEnter.bind(this);
    this.handleClearSearch = this.handleClearSearch.bind(this);
    this.getValueFromSelectedOptions = this.getValueFromSelectedOptions.bind(this);
    this.getInitValue = this.getInitValue.bind(this);
  }

  getInitValue() {
    const { value, selectedOptions, firstAsDefault, options } = this.props;
    if (value) return value;
    if (firstAsDefault && options.length) {
      const defaultValue = options[0].value || options[0];
      return defaultValue;
    }
    if (Array.isArray(selectedOptions) && selectedOptions.length) {
      const defaultValue = this.getValueFromSelectedOptions(selectedOptions);
      return defaultValue;
    }
  }

  checkIsMultipleSelected(values, option) {
    // if (!Array.isArray(this.state.value) || this.state.value.length < 1) return false;
    return findIndex(values, (o) => {
      const current = o.value || o;
      return current === option;
    });
  }

  getValueFromSelectedOptions(options) {
    const values = options.map(option => option.value);
    if (!this.props.multiple) return values[0];
    return values;
  }

  handleOnChange(option) {
    const value = option.value || option;
    const { onChange, name, multiple } = this.props;
    if (multiple) {
      const index = this.state.value && this.checkIsMultipleSelected(this.state.value, value);
      const selectedOptions = this.state.selectedOptions || [];
      if (index > -1) {
        const values = this.state.value;
        values.splice(index, 1);
        selectedOptions.splice(index, 1);
        this.setState({ value: values, selectedOptions }, onChange(values, name));
        return;
      }

      const values = this.state.value || [];
      values.push(value);
      selectedOptions.push(option);
      this.setState({ value: values, selectedOptions }, onChange(values, name));
    } else {
      const selectedOptions = [];
      selectedOptions.push(option);
      this.setState({ value, selectedOptions }, onChange(value, name));
    }
  }

  renderOptions() {
    const { multiple, hasSearch, appendix } = this.props;
    const { options } = this.state;
    return (
      <div>
        {hasSearch ? this.renderSearch() : null}
        <ul className="select-options">
          {options.length < 1 ? <li className="select-option">no data</li> : null}
          {options.map((option, index) => {
            const value = option.value || option;
            const isSelected = multiple
              ? this.checkIsMultipleSelected(this.state.value, value) > -1
              : (this.state.value === value);

            return (
              <li
                className={classNames('select-option', { 'is-selected': isSelected })}
                key={`${option.value || option}-${index}`}
                onClick={() => this.handleOnChange(option)}
              >{option.label || option}
              </li>
            );
          })}
        </ul>
        {appendix && <div className="select-appendix" onClick={e => e.stopPropagation()}>{appendix}</div>}
      </div>
    );
  }

  renderSelected() {
    const { multiple, placeholder, options } = this.props;
    if (multiple) {
      if (!Array.isArray(this.state.value) || this.state.value.length < 1) return placeholder;
      const tags = this.state.value.map((option, index) => {
        let selected = find(this.state.selectedOptions, { value: option.value || option });
        selected = selected || find(options, { value: option.value || option }) || {};
        const label = selected.label || option.label || option;
        return (
          <Tag
            key={`${option}-${index}`}
            closable={true}
            type="primary"
            onClose={() => this.handleOnChange(option)}
          >{label}
          </Tag>
        );
      });
      return <div className="tags">{tags}</div>;
    }

    let selected = find(this.state.selectedOptions, { value: this.state.value });
    selected = selected || find(options, { value: this.state.value }) || {};
    return selected.label || this.state.value || placeholder;
  }

  renderSearch() {
    return (
      <div className="select-search">
        <div className="control has-icon has-icon-right">
          <input
            className="input"
            type="text"
            ref={ref => { this.searchInput = ref; }}
            placeholder="搜索"
            onClick={e => e.stopPropagation()}
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
    );
  }

  handleEnter(e) {
    if (e.keyCode === 13) this.handleSearch(e);
  }

  handleSearch(e) {
    e.stopPropagation();
    if (!this.state.search_word) return;
    this.setState({ searched: true });

    if (isFunction(this.props.onSearch)) {
      this.props.onSearch(this.state.search_word);
    } else {
      const options = filter(this.state.options, item => {
        if (typeof item.label === 'string') {
          return item.label.indexOf(this.state.search_word) > -1;
        }
      });
      this.setState({ options });
    }
  }

  handleClearSearch(e) {
    e.stopPropagation();
    this.searchInput.value = '';
    this.setState({ searched: false, search_word: '' });
    if (isFunction(this.props.onSearch)) {
      this.props.onSearch('');
    } else {
      this.setState({ options: this.props.options });
    }
  }

  handleSearchWordChange(e) {
    this.setState({ search_word: trim(e.target.value) });
  }

  componentDidMount() {
    const width = this.wrapRef && this.wrapRef.offsetWidth;
    if (width) {
      this.setState({ width });
    }
  }

  componentWillReceiveProps(nextProps) {
    if (!isEqual(nextProps.value, this.props.value)) {
      this.setState({ value: nextProps.value });
    }
    if (!isEqual(nextProps.options, this.props.options)) {
      this.setState({ options: nextProps.options });
    }
    if (!isEqual(nextProps.selectedOptions, this.props.selectedOptions)) {
      this.setState({ selectedOptions: nextProps.selectedOptions });
    }
  }

  render() {
    const options = this.renderOptions();
    const selected = this.renderSelected();
    const { size, readOnly, multiple } = this.props;

    return (
      <div className="control" ref={ref => { this.wrapRef = ref; }}>
        <Dropdown content={options} width={this.state.width} wrapClassName="dropdown-select" disabled={readOnly}>
          <div className={classNames('select-wrap', 'select', { [`is-${size}`]: size, 'is-multiple': multiple })}>
            <div className="selected">{selected}</div>
            <span className="dropdown-arrow"><i className="fa fa-angle-down"></i></span>
          </div>
        </Dropdown>
      </div>
    );
  }
}

export default Select;
