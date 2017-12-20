import React from 'react';
import { inject, observer } from 'mobx-react';
import { Menu, Menus, Icon } from '../component/common';

@inject('rootStore')
@observer
class Root extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="container is-fluid mainpage">
        <div className="columns" style={{height: '100%'}}>
          <div className="column is-2 menubox">
            <input/>
            <Menus>
              <Menu>1</Menu>
              <Menu>2</Menu>
              <Menu>3</Menu>
            </Menus>
          </div>
          <div className="column is-10 room">
            <div className="chatInfo"></div>
            <div className="message">
              {this.props.children}
            </div>
            <div className="wordarea">
              <div className="toolbar">
                <Icon name="smile-o" size="medium"/>
                <Icon name="folder-o" size="medium"/>
              </div>
              <textarea  rows="6"></textarea>
              <button className="pull-right">发送</button>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default Root;
