import React from 'react';
import ReactDOM from 'react-dom';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { Icon } from '../';

class Menus extends React.Component {
  static propTypes = {
    label: PropTypes.string,
    type: PropTypes.string,
    isSub: PropTypes.bool,
    icon: PropTypes.string,
    selected: PropTypes.bool,
    toggled: PropTypes.bool,
    iconPrefix: PropTypes.string,
    onClick: PropTypes.func,
    activeKey: PropTypes.string,
    className: PropTypes.string,
  };

  constructor(props) {
    super(props);

    this.state = {
      isOpen: props.selected,
      isActive: false,
      arrowClass: 'angle-down',
    };
  }

  handleClickOpen = (e) => {
    if (this.props.onClick) {
      this.props.onClick();
    }
    this.setState({
      isOpen: !this.state.isOpen, 
      arrowClass: !this.state.isOpen ? 'angle-up' : 'angle-down',
    });
  }

  render() {
    const {
      label,
      children,
      isSub,
      icon,
      iconPrefix,
      activeKey,
      selected,
      className,
    } = this.props;
    const type = this.state.type;
    const { isOpen, arrowClass } = this.state;

    if (!isSub) {
      return (
        <div>
          {label ? <p className="menu-label">{label}</p> : null}
          <ul className={classNames('menu-list', className)}>
            {children}
          </ul>
        </div>
      );
    } else if (isSub && label) {
      const style = isOpen ? null : { display: 'none' };
      return (
        <li className={classNames({ 'is-selected': isOpen })}>
          <a
            className={classNames('has-children', { 'is-active': this.state.isActive, 'is-open': isOpen })}
            onClick={this.handleClickOpen}
          >
            {icon ? <Icon name={icon} prefix={iconPrefix}/> : null}
            {label}
            <span className="toggle-icon"><Icon name={arrowClass}/></span>
          </a>
          <ul style={style} className={classNames('menu-list', type)}>{children}</ul>
        </li>
      );
    }
  }
}

export default Menus;