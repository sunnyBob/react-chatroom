import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

class Icon extends React.Component {
  static propTypes = {
    prefix: PropTypes.string,
    name: PropTypes.string,
    size: PropTypes.string,
    className: PropTypes.string,
  };

  static defaultProps = {
    prefix: 'fa',
    size: 'small',
  };

  render() {
    const { prefix, name, size, className } = this.props;
    const classes = `${prefix} ${prefix}-${name}`;
    return (
      <span {...this.props} className={classNames('icon', { [`is-${size}`]: size }, className)}>
        <i className={classes}></i>
      </span>
    );
  }
}

export default Icon;
