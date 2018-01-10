import React, { Component } from 'react';
import ReactDOM, { render }  from 'react-dom';
import Popover from './popover';

export default class PopoverManager extends Component {
  static open(options = {}) {
    const { x = 0, y = 0, content, reverse = false } = options;
    if (document.getElementsByClassName("popover").length) {
      const result = ReactDOM.unmountComponentAtNode(document.getElementsByClassName("popover"));
      if (result) {
        document.getElementsByClassName("popover")[0].remove();
      }
    }
    const container = document.createElement('div');
    container.className = 'popover';
    document.body.appendChild(container);
    const close = (popover) => {
      const result = ReactDOM.unmountComponentAtNode(popover);
      if (result) {
        popover.remove();
        document.removeEventListener('mouseup', (e) => {
          const _con = container;
          if (window.Node && Node.prototype && !Node.prototype.contains){
            Node.prototype.contains = function (arg) {
              return !!(this.compareDocumentPosition(arg) & 16)
            }
          }
          if (!container.contains(e.target)){
            close(_con);
          }
        });
      }
    }
    document.addEventListener('mouseup', (e) => {
      const _con = container;
      if (window.Node && Node.prototype && !Node.prototype.contains){
        Node.prototype.contains = function (arg) {
          return !!(this.compareDocumentPosition(arg) & 16)
        }
      }
      if (!container.contains(e.target)){
        close(_con);
      }
    });
    render(
      <Popover content={content}/>,
      container
    );
    container.style.left = x + 'px';
    container.style.top = (reverse ? y - container.clientHeight : y) + 'px';
    return container;
  }
}
