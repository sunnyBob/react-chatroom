import React from 'react';
import ReactDOM from 'react-dom';
import classNames from 'classnames';
import { Icon } from '../icon';

class Card extends React.Component {
  handleClose = () => {
    const node = ReactDOM.findDOMNode(this);
    if (this.props.handleClose) {
      this.props.handleClose(node);
    } else {
      node.parentNode.removeChild(node);
      this.props.handleClose && this.props.handleClose();
    }
  }

  render() {
    const { children, title, icon, footer, className,
      enableClose = false, showHeader = true, showFooter = true
    } = this.props;
    return (
      <div className={classNames('card', className)}>
        {
          showHeader 
            ? <header className="card-header">
              <p className="card-header-title">
                {title}
              </p>
              {enableClose ? <Icon name="times" className="icon-close" onClick={this.handleClose}/> : null}
            </header> : null
        }
        <div className="card-content">
          <div className="content">
            {children}
          </div>
        </div>
        {
          showFooter
            ? <footer className="card-footer">
                {footer}
              </footer>
            : null
        }
      </div>
    );
  }
}

export default Card;
