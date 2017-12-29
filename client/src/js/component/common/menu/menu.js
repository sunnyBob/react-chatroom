import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import { Icon } from '../';

class Menu extends React.Component {
  static propTypes = {
    label: PropTypes.string,
    type: PropTypes.string,
    iconPrefix: PropTypes.string,
    icon: PropTypes.string,
    selected: PropTypes.bool,
    onClick: PropTypes.func,
    to: PropTypes.string,
  };

  constructor(props) {
    super(props);

    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(e) {
    this.props.onClick && this.props.onClick(e);
  }

  render() {
    const { children, icon, to, iconPrefix } = this.props;
    console.log(children)
    const iconEl = icon ? <Icon name={icon} prefix={iconPrefix}/> : null;
    return (
      <li>
        <Link to={to} activeClassName="is-active" onClick={this.handleClick}>{iconEl}{children}</Link>
      </li>
    );
  }
}

export default Menu;
