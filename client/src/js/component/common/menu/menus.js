import React from 'react';
import ReactDOM from 'react-dom';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import Icon from '../icon';

class Menus extends React.Component {
  static propTypes = {
    label: PropTypes.string,
    type: PropTypes.string,
    floatPosition: PropTypes.string,
    isSub: PropTypes.bool,
    icon: PropTypes.string,
    selected: PropTypes.bool,
    toggled: PropTypes.bool,
    collapse: PropTypes.bool,
    iconPrefix: PropTypes.string,
    onClick: PropTypes.func,
    activeKey: PropTypes.string,
    className: PropTypes.string,
  };

  constructor(props) {
    super(props);

    const type = props.collapse ? 'float' : props.type;
    this.state = {
      isOpen: props.selected,
      isActive: false,
      type,
    };

    this.handleToggleOpen = this.handleToggleOpen.bind(this);
    this.handleBindEvent = this.handleBindEvent.bind(this);
    this.handleRemoveEvent = this.handleRemoveEvent.bind(this);
    this.handleClickOpen = this.handleClickOpen.bind(this);
  }

  handleToggleOpen() {
    this.setState({ isOpen: !this.state.isOpen });
  }

  handleClickOpen() {
    if (this.props.onClick) {
      this.props.onClick();
    }
    if (this.state.type === 'float') return;
    this.setState({ isOpen: !this.state.isOpen });
  }

  handleBindEvent() {
    if (this.props.isSub && this.state.type === 'float') {
      const node = ReactDOM.findDOMNode(this);
      node.addEventListener('click', this.handleClick);
      node.addEventListener('mouseenter', this.handleToggleOpen);
      node.addEventListener('mouseleave', this.handleToggleOpen);
    }
  }

  handleRemoveEvent() {
    if (this.props.isSub && this.state.type === 'float') {
      const node = ReactDOM.findDOMNode(this);
      node.removeEventListener('click', this.handleClick);
      node.removeEventListener('mouseenter', this.handleToggleOpen);
      node.removeEventListener('mouseleave', this.handleToggleOpen);
    }
  }

  componentDidMount() {
    this.handleBindEvent();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.collapse !== this.state.collapse) {
      if (nextProps.collapse) {
        this.state.isOpen = false;
        this.state.type = 'float';
        this.handleBindEvent();
      } else {
        this.handleRemoveEvent();
        this.state.type = '';
      }
      this.setState({
        collapse: nextProps.collapse,
      });
    }
  }

  componentWillUnmount() {
    if (this.props.isSub && this.state.type === 'float') {
      const node = ReactDOM.findDOMNode(this);
      node.removeEventListener('mouseenter', this.handleToggleOpen);
      node.removeEventListener('mouseleave', this.handleToggleOpen);
    }
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
      collapse,
      className,
      floatPosition,
    } = this.props;
    const type = this.state.type;
    let isOpen = false;
    if (collapse || this.props.type === 'float') {
      isOpen = this.state.isOpen;
    } else if (!activeKey && activeKey !== 'none') {
      isOpen = selected;
    } else {
      isOpen = activeKey === label;
    }
    const arrowClass = type === 'float' ? 'angle-right' : 'angle-down';

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
          <ul style={style} className={classNames('menu-list', type, floatPosition)}>{children}</ul>
        </li>
      );
    }
  }
}

export default Menus;
