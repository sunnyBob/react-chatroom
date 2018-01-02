import React from 'react';
import { Menu, Menus, Icon } from '../component/common';
import UserInfo from './userInfo';
import { ModalManager } from '../component/common/modal';

class Root extends React.Component {
  render() {
    ModalManager.open({
      content: '222',
      needPortal: true,
    })
    return (
      <div className="container is-fluid mainpage">
        <div className="columns" style={{height: '100%'}}>
          <div className="column is-2 menubox">
            <UserInfo/>
            <input className="input"/>
            <Menus>
              <Menus label="我的好友" isSub={true}>
                <Menu to="/chat/xxx">xxx</Menu>
                <Menu to="/chat/1">1</Menu>
                <Menu to="/chat/2">2</Menu>
                <Menu to="/chat/3">3</Menu>
              </Menus>
              <Menus label="我的群组" isSub={true}>
                <Menus label="我加入的群" isSub={true}></Menus>
                <Menus label="我创建的群" isSub={true}></Menus>
                <Menus label="我管理的群" isSub={true}></Menus>
              </Menus>
            </Menus>
          </div>
          <div className="column is-10 room">
            <div className="chatInfo"></div>
            <div className="message">
              {this.props.children}
            </div>
            <div className="wordarea">
              <div className="toolbar is-clearfix">
                <Icon name="smile-o" size="medium"/>
                <Icon name="folder-o" size="medium"/>
              </div>
              <textarea className="textarea is-primary"></textarea>
              <button className="pull-right">发送</button>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default Root;
