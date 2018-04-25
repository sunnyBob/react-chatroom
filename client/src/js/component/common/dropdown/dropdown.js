import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Icon } from '../';
import './dropdown.less';

class Dropdown extends React.Component {
  static propTypes = {
    align: PropTypes.oneOf(['right', 'up']),
    items: PropTypes.array,
    triggerEl: PropTypes.element,
    className: PropTypes.string,
  };

  constructor(props) {
    super(props);

    this.state = {
      isShow: false,
    };
  } 

  componentWillMount() {
    document.addEventListener('mouseup', (e) => {
      const _con = this.container;
      if (window.Node && Node.prototype && !Node.prototype.contains){
        Node.prototype.contains = function (arg) {
          return !!(this.compareDocumentPosition(arg) & 16)
        }
      }
      if (_con && !_con.contains(e.target)){
        this.setState({
          isShow: false,
        });
      }
    });
  }

  componentWillUnmount() {
    document.removeEventListener('mouseup', (e) => {
      const _con = this.container;
      if (window.Node && Node.prototype && !Node.prototype.contains){
        Node.prototype.contains = function (arg) {
          return !!(this.compareDocumentPosition(arg) & 16)
        }
      }
      if (!_con.contains(e.target)){
        this.setState({
          isShow: false,
        });
      }
    });
  }

  toggle() {
    this.setState({isShow: !this.state.isShow});
  }

  handleClick(handleClick) {
    this.toggle();
    handleClick && handleClick();
  }
  
  genItems() {
    const { hasDividers, items = [] } = this.props;
    return items.map((item, index) => 
      <div key={index}>
        <a className='dropdown-item' onClick={this.handleClick.bind(this, item.handleClick)}>
          <span>{item.content}</span>
          {item.icon ? <Icon name={item.icon}/> : null}
        </a>
        { hasDividers ? index !== items.length - 1 && <hr className="dropdown-divider"/> : null}
      </div>
    );
  }

  render() {
    const { triggerEl, align, className } = this.props;
    const { isShow } = this.state;

    return (
      <div ref={con => { this.container = con }} className={classNames('dropdown', className, {[`is-${align}`]: align}, {'is-active': isShow})}>
        <div className="dropdown-trigger" onClick={::this.toggle}>
          {triggerEl}
        </div>
        <div className="dropdown-menu" id="dropdown-menu6" role="menu">
          <div className="dropdown-content">
            {this.genItems()}
          </div>
        </div>
      </div>
    );
  }
}

export default Dropdown;
