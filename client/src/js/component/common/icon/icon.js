import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

class Icon extends React.Component {
  static propTypes = {
    prefix1: PropTypes.string,
    prefix2: PropTypes.string,
    name: PropTypes.string,
    size: PropTypes.string,
    className: PropTypes.string,
  };

  static defaultProps = {
    prefix1: 'fa',
    prefix2: 'fa',
    size: 'small',
  };

  render() {
    const { prefix1, prefix2, name, size, className } = this.props;
    const classes = `${prefix1} ${prefix2}-${name}`;
    let fa = '';
    if (size === 'small') {
      fa = '1x';
    } else if (size === 'medium') {
      fa = '2x';
    } else if (size === 'large') {
      fa = '3x';
    }
    return (
      <span {...this.props} className={classNames('icon', { [`is-${size}`]: size }, className)}>
        <span className={classNames('fa', { [`fa-${fa}`]: fa})}>
          <i className={classes}></i>
        </span>
      </span>
    );
  }
}

export default Icon;
