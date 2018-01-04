import React from 'react';
import { inject, observer } from 'mobx-react';
import { Menu, Menus } from '../common';
import UserInfo from './userInfo';
import FriendList from './friendList';

@inject('RootStore')
@observer
class Root extends React.Component {
  constructor(props) {
    super(props);
    const user = localStorage.getItem('user');
    this.user = JSON.parse(user);
    this.store = new props.RootStore();
    this.fetchData();
  }

  fetchData = () => {
    this.store.getFriends(this.user.user_id);
  }

  render() {
    return (
      <div className="container is-fluid mainpage">
        <div className="columns" style={{height: '100%'}}>
          <div className="column is-2 menubox">
            <UserInfo info={this.user}/>
            <input className="input"/>
            <Menus>
              <FriendList friendsList={this.store.friendsInfo}/>
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
