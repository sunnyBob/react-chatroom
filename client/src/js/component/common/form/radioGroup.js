import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Radio from './radio';

class radioGroup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: ''
    };
  }
  
  handleChange = (e) => {
    if (e.target.checked) {
      this.setState({
        value: e.target.value,
      }, () => {
        this.props.onChange && this.props.onChange(this.props.name, this.state.value);
      });
    }
    this.setState({
      isChecked: e.target.value === this.state.value,
    });
  }

  render() {
    const { label, options, name } = this.props;
    return (
      <div className="field">
        <label className="label is-small">{label}</label>
        <div className="control">
          {
            options.map((option) => {
              const { label, value } = option;
              return <Radio
                key={value}
                name={name}
                value={value}
                label={label}
                checked={this.state.isChecked}
                onChange={this.handleChange}
              />
            })
          }
        </div>
      </div>
    );
  }
}

export default radioGroup;
