import React, { Component } from 'react';
import PropTypes from 'prop-types';

class Radio extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isChecked: false,
    };
  }
  
  componentWillReceiveProps(nextProps) {
    if (nextProps.checked !== this.state.isChecked) {
      this.setState({ isChecked: nextProps.checked });
    }
  }

  handleChange = (e) => {
    this.setState({
      isChecked: e.target.checked,
    });

    this.props.onChange && this.props.onChange(e);
  }

  render() {
    const { name, value, label } = this.props;
    return (
      <label className="radio">
        <input type="radio" name={name} checked={this.state.isChecked} value={value} onChange={this.handleChange}/>
        {label}
      </label>
    );
  }
}

export default Radio;
