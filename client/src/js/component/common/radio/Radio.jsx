import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

class Radio extends React.Component {
  static propTypes = {
    name: PropTypes.string,
    disabled: PropTypes.bool,
    checked: PropTypes.bool,
    type: PropTypes.string,
    onChange: PropTypes.func,
  };

  constructor(props) {
    super(props);

    this.state = {
      isChecked: props.checked,
    };
    this.handleToggleChecked = this.handleToggleChecked.bind(this);
  }

  handleToggleChecked(e) {
    const { disabled, onChange } = this.props;
    if (!disabled) {
      const isChecked = e.target.checked;
      this.setState({ isChecked });
      if (onChange) onChange(e);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.checked !== this.state.isChecked) {
      this.setState({ isChecked: nextProps.checked });
    }
  }

  render() {
    const {
      name,
      children,
      disabled,
      type,
      value,
    } = this.props;
    const isChecked = !!this.state.isChecked;

    return (
      <label
        className={classNames(
          'radio',
          'radio-wrap',
          { 'is-disabled': disabled },
          { on: isChecked },
          { [`is-${type}`]: type },
        )}
        onClick={e => e.stopPropagation()}
      >
        <input
          type="radio"
          name={name}
          disabled={disabled}
          checked={isChecked}
          value={value}
          onChange={this.handleToggleChecked}
        />
        {children}
      </label>
    );
  }
}

export default Radio;
