import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Transition from '../transition';

class Tag extends React.Component {
  static propTypes = {
    type: PropTypes.string,
    size: PropTypes.string,
    closable: PropTypes.bool,
    rounded: PropTypes.bool,
    onClose: PropTypes.func,
    onClick: PropTypes.func,
    title: PropTypes.string,
    color: PropTypes.string,
    className: PropTypes.string,
  };

  static defaultProps = {
    rounded: false,
  };

  constructor() {
    super();
    this.state = {
      isShow: true,
    };

    this.handleClose = this.handleClose.bind(this);
  }

  handleClose(e) {
    let isClose = false;
    const onClose = this.props.onClose;
    if (onClose) isClose = onClose(e);
    if (e.defaultPrevented) {
      if (isClose) this.setState({ isShow: false });
      return;
    }

    this.setState({ isShow: false });
  }

  componentDidMount() {
    if (this.props.onClick) {
      this.tagRef.addEventListener('click', this.props.onClick);
    }
  }

  render() {
    const {
      type,
      size,
      closable,
      rounded,
      children,
      title,
      color,
      className,
    } = this.props;

    const typeClass = type ? `is-${type}` : null;
    const sizeClass = size ? `is-${size}` : null;
    const btnClass = size === 'large' ? null : 'is-small';
    const roundedClass = rounded ? 'is-rounded' : 'is-square';
    const tagClasses = classNames('tag', typeClass, sizeClass, roundedClass, className);
    const style = color ? { backgroundColor: color } : null;

    return (
      <Transition
        in={this.state.isShow}
        enteringClassName="fade"
        exitingClassName="fade"
        unmountOnExit={true}
        timeout={300}
      >
        <span className={tagClasses} style={style} ref={ref => { this.tagRef = ref; }}>
          {title ? `${title}: ` : null}{children}
          {
            closable &&
            <button className={classNames(btnClass, 'delete')} onClick={this.handleClose}></button>
          }
        </span>
      </Transition>
    );
  }
}

export default Tag;
