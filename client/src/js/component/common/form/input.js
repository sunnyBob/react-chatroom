import React, { Component } from 'react';
import PropTypes from 'prop-types';

class Input extends Component {
  static defaultProps = {
    isHorizontal: false,
    type: 'text',
    label: '',
    name: '',
    required: false,
  }

  constructor(props) {
    super(props);
    this.state = {
      helpContent: props.helpContent || '',
      helpStyle: props.helpStyle || 'danger'
    };
  }
  
  handleChange = (e) => {
    const { name, value } = e.target;
    const { reg, required, regTip } = this.props;
    if (required && !value) {
      this.setState({
        helpContent: '该字段为必填字段',
        helpStyle: 'danger',
      })
    } else if((required && value) || (!required && !value)) {
      this.setState({
        helpContent: '',
      });
    }
    if (value && reg) {
      if (!reg.test(value)) {
        this.setState({
          helpContent: regTip || '数据格式不合法',
          helpStyle: 'danger',
        });
      } else {
        this.setState({
          helpContent: '',
        });
      }
    }
    this.props.handleChange && this.props.handleChange(name, value);
  }

  render() {
    const { label, name, type, defaultValue, placeholder, isHorizontal, required, reg } = this.props;
    const { helpContent, helpStyle } = this.state;
    return (
      <div>
        {
          isHorizontal ?
            (<div className="field is-horizontal">
              <div className="field-label is-small">
                <label className="label">{required ? `${label}*` : label}</label>
              </div>
              <div className="field-body">
                <div className="field">
                  <div className="control">
                    <input className="input is-small" autoComplete="off" type={type} placeholder={placeholder} defaultValue={defaultValue} onBlur={this.handleChange}/>
                  </div>
                  {
                    helpContent ? <p className={`help is-${helpStyle}`}>
                      {helpContent}
                    </p> : null
                  }
                </div>
              </div>
            </div>) :
            (<div className="field">
              <label className="label is-small">{required ? `${label}*` : label}</label>
              <div className="control">
                <input className="input is-small" autoComplete="off" type={type} name={name} placeholder={placeholder} defaultValue={defaultValue} onBlur={this.handleChange}/>
              </div>
              {
                helpContent ? <p className={`help is-${helpStyle}`}>
                  {helpContent}
                </p> : null
              }
            </div>)
        }
      </div>
    );
  }
}

Input.propTypes = {
  isHorizontal: PropTypes.bool,
  helpContent: PropTypes.string,
  handleChange: PropTypes.func,
  type: PropTypes.oneOf(['password', 'text', 'number', 'email']),
  name: PropTypes.string,
  placeholder: PropTypes.string,
  defaultValue: PropTypes.string,
  value: PropTypes.string,
  helpStyle: PropTypes.oneOf(['success', 'warning', 'danger']),
  label: PropTypes.string,
  required: PropTypes.bool,
}

export default Input;
