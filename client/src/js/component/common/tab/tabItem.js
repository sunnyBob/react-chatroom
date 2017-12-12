import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

class TabItem extends PureComponent {
  constructor(props) {
    super(props);
  }
  
  render() {
    const { iconSize, icon, content, handleClick, index, isActive } = this.props;
    return (
      <li className={isActive ? 'is-active' : ''} onClick={() => handleClick(this.props.children, index)}>
        <a>
          <span className={`icon is-${iconSize || 'small'}`}><i className={`fa fa-${icon}`}></i></span>
          <span>{content}</span>
        </a>
      </li>
    );
  }
}

TabItem.propTypes = {
  icon: PropTypes.string,
  iconSize: PropTypes.string,
  content: PropTypes.string,
  className: PropTypes.string,
};

export default TabItem;
