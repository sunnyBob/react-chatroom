import React from 'react';
import { inject, observer } from 'mobx-react';
import { Menu, Menus } from '../common';
import UserInfo from './userInfo';

@inject('rootStore')
@observer
class Root extends React.Component {
  constructor(props) {
    super(props);
    this.user = JSON.parse(localStorage.getItem('user'));
  }

  render() {
    return (
      <div className="container is-fluid mainpage">
        <div className="columns" style={{height: '100%'}}>
          <div className="column is-2 menubox">
            <UserInfo info={this.user}/>
            <input className="input"/>
            <Menus>
              <Menus label="我的好友" isSub={true} selected={true}>
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
          <div className="column is-10">
            {this.props.children}
          </div>
        </div>
      </div>
    )
  }
}

export default Root;
