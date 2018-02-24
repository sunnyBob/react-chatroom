import React from 'react';
import PropTypes from 'prop-types';
import { remove, isEqual } from 'lodash';
import Checkbox from './Checkbox';

class CheckboxGroup extends React.Component {
  static propTypes = {
    options: PropTypes.array,
    value: PropTypes.array,
    onChange: PropTypes.func,
    type: PropTypes.string,
    name: PropTypes.string,
  };

  static defaultProps = {
    value: [],
  };

  constructor(props) {
    super(props);
    this.value = props.value.slice();

    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(e) {
    e.stopPropagation();

    if (e.target.checked) {
      this.value.push(e.target.value);
    } else {
      remove(this.value, v => v === e.target.value);
    }
    this.props.onChange && this.props.onChange(this.value, this.props.name);
  }

  componentWillReceiveProps(nextProps) {
    if (!isEqual(this.props.value, nextProps.value)) {
      this.value = nextProps.value;
    }
  }

  render() {
    const { options, type } = this.props;

    return (
      <div className="control">
        {options.map(option => {
          const value = option.value || option;
          const label = option.label || option;
          const checked = this.value.indexOf(value) > -1;
          return (
            <Checkbox
              key={`checkbox-${value}`}
              disabled={option.disabled}
              value={value}
              onChange={this.handleChange}
              type={type}
              checked={checked}
            >{label}</Checkbox>
          );
        })}
      </div>
    );
  }
}

export default CheckboxGroup;
