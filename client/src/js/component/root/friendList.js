import React from 'react';
import { browserHistory } from 'react-router';
import { toJS } from 'mobx';
import { Menu, Menus, Icon } from '../common';

class UserInfo extends React.Component {
  render() {
    const { friendsList } = this.props;
    return (
      <Menus label="我的好友" isSub={true} selected={true}>
        {
          toJS(friendsList).map(friend => (
            <Menu
              to={`/chat/${friend.friend_id}`}
              avatar={friend.avatar}
              key={friend.friend_id}
            >
              {friend.friend_name}
            </Menu>
          ))
        }
      </Menus>
    );
  }
}

export default UserInfo;
