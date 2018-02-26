import React from 'react';
import PropTypes from 'prop-types';
import Radio from './Radio';

class RadioGroup extends React.Component {
  static propTypes = {
    options: PropTypes.array,
    value: PropTypes.string,
    onChange: PropTypes.func,
    type: PropTypes.string,
    name: PropTypes.string,
  };

  constructor(props) {
    super(props);
    this.state = {
      value: props.value,
    };

    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(e) {
    e.stopPropagation();

    let value = e.target.value;
    if (e.target.checked) {
      this.setState({ value: e.target.value });
    } else {
      value = undefined;
      this.setState({ value: undefined });
    }
    this.props.onChange && this.props.onChange(value, this.props.name);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.value !== nextProps.value) {
      this.setState({ value: nextProps.value });
    }
  }

  render() {
    const { options, type } = this.props;

    return (
      <div className="control">
        {options.map(option => {
          const value = option.value || option;
          const label = option.label || option;
          const checked = this.state.value === value;

          return (
            <Radio
              key={`radio-${value}`}
              disabled={option.disabled}
              value={value}
              onChange={this.handleChange}
              type={type}
              checked={checked}
            >{label}</Radio>
          );
        })}
      </div>
    );
  }
}

export default RadioGroup;
