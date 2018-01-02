import React from 'react';
import { inject, observer } from 'mobx-react';
import { Menu, Menus, Icon } from '../component/common';
import { locale } from 'core-js/library/web/timers';

@inject('rootStore')
@observer
class UserInfo extends React.Component {
  constructor(props) {
    super(props);
    const user = JSON.parse(localStorage.getItem('user'));
    this.store = new props.rootStore();
    this.store.getUser(user.user_id);
  }

  render() {
    const { userInfo } = this.store;
    return (
      <div className="user-info">
        <img src={userInfo.avatar || ''} className="avatar"/>
        <span>{userInfo.username}</span>
      </div>
    );
  }
}

export default UserInfo;
