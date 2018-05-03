import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Transition from '../transition';

class Modal extends React.Component {
  static propTypes = {
    isOpen: PropTypes.bool,
    title: PropTypes.node,
    width: PropTypes.number,
    height: PropTypes.number,
    okText: PropTypes.string,
    cancelText: PropTypes.string,
    backdrop: PropTypes.bool,
    closable: PropTypes.bool,
    backdropClosable: PropTypes.bool,
    showOk: PropTypes.bool,
    showCancel: PropTypes.bool,
    showHeader: PropTypes.bool,
    showFooter: PropTypes.bool,
    asyncConfirm: PropTypes.bool,
    transition: PropTypes.string,
    onOk: PropTypes.func,
    onCancel: PropTypes.func,
    onClose: PropTypes.func,
    header: PropTypes.node,
    footer: PropTypes.node,
    wrapClass: PropTypes.string,
    defaultClass: PropTypes.string,
  };

  static defaultProps = {
    isOpen: false,
    width: 640,
    okText: '确定',
    cancelText: '取消',
    closable: true,
    backdrop: true,
    backdropClosable: true,
    showOk: true,
    showCancel: true,
    showHeader: true,
    showFooter: true,
    transition: 'fade',
    onOk: () => true,
    onCancel: () => {},
    onClose: () => {},
    asyncConfirm: false,
    defaultClass: 'modal align-baseline',
  };

  constructor(props) {
    super(props);

    this.handleBackdropClose = this.handleBackdropClose.bind(this);
    this.handleOk = this.handleOk.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.handleClose = this.handleClose.bind(this);

    this.state = {
      isOpen: this.props.isOpen,
      isLoading: false,
    };
  }

  handleOk() {
    if (this.props.asyncConfirm) {
      this.setState({ isLoading: true });
      const isOk = this.props.onOk();
      if (isOk) {
        this.handleClose();
      } else {
        this.setState({ isLoading: false });
      }
    } else {
      const isOk = this.props.onOk();
      if (isOk) this.handleClose();
    }
  }

  handleCancel() {
    this.props.onCancel();
    this.handleClose();
  }

  handleBackdropClose() {
    if (this.props.backdropClosable) {
      this.handleClose();
    }
  }

  handleClose() {
    if (!this.props.closable) return;
    this.setState({
      isOpen: false,
      isLoading: false,
    });
    setTimeout(this.props.onClose, 300);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.isOpen !== this.props.isOpen) {
      this.setState({
        isOpen: nextProps.isOpen,
      });
    }
  }

  render() {
    const {
      title,
      width,
      height,
      okText,
      cancelText,
      backdrop,
      showOk,
      showCancel,
      transition,
      header,
      showHeader,
      footer,
      showFooter,
      children,
      wrapClass,
      defaultClass,
      closable,
    } = this.props;

    const isOpen = this.state.isOpen;
    const modalClass = classNames(
      defaultClass,
      'is-active',
      { 'modal-hidden': !isOpen },
      wrapClass,
    );

    let headerEl = null;
    if (showHeader) {
      headerEl = <header className="modal-card-head">{header}</header>;
      if (!header) {
        headerEl = (
          <header className="modal-card-head">
            <p className="modal-card-title">{title}</p>
            {closable ? <span className="times" onClick={this.handleClose}>×</span> : null}
          </header>
        );
      }
    }

    let footerEl = null;
    if (showFooter) {
      footerEl = <footer className="modal-card-foot">{footer}</footer>;
      if (!footer) {
        footerEl = (
          <footer className="modal-card-foot">
            {showCancel ? <a className="button" onClick={this.handleCancel}>{cancelText}</a> : null}
            {showOk ? <a className="button is-primary" onClick={this.handleOk}>{okText}</a> : null}
          </footer>
        );
      }
    }

    const style = { width: `${width}px` };
    if (height) {
      if (typeof height === 'string' && height.indexOf('px') < 0) {
        style.height = `${height}`;
      } else {
        style.height = `${height}px`;
      }
    }
    const modalEL = (
      <div className={modalClass}>
        {backdrop ?
          <Transition in={isOpen} enteringClassName="fade" exitingClassName="fade">
            <div className="modal-background" onClick={this.handleBackdropClose}></div>
          </Transition>
          : null
        }
        <Transition
          in={isOpen}
          enteringClassName={transition}
          exitingClassName={transition}
          transitionAppear={true}
        >
          <div className="modal-card" style={style}>
            {headerEl}
            <section className="modal-card-body">
              {children}
            </section>
            {footerEl}
          </div>
        </Transition>
      </div>
    );

    return modalEL;
  }
}

export default Modal;
