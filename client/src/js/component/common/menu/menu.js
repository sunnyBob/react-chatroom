import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Link } from 'react-router';
import { Icon } from '../';

class Menu extends React.Component {
  static propTypes = {
    label: PropTypes.string,
    type: PropTypes.string,
    iconPrefix1: PropTypes.string,
    iconPrefix2: PropTypes.string,
    icon: PropTypes.string,
    selected: PropTypes.bool,
    onClick: PropTypes.func,
    to: PropTypes.string,
    avatar: PropTypes.string,
  };

  constructor(props) {
    super(props);

    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(e) {
    this.props.onClick && this.props.onClick(e);
  }

  render() {
    const { children, icon, to, iconPrefix1, iconPrefix2, attachEl, isActive, className } = this.props;
    const iconEl = icon ? <Icon name={icon} prefix1={iconPrefix1} prefix2={iconPrefix2}/> : null;
    const attach = attachEl ? attachEl : null;
    return (
      <li>
        <Link to={to} activeClassName="is-active" className={classNames(className, {'is-active': isActive})} onClick={this.handleClick}>{attachEl}{iconEl}{children}</Link>
      </li>
    );
  }
}

export default Menu;
