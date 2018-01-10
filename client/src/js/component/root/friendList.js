import React from 'react';
import { browserHistory, Link } from 'react-router';
import { toJS } from 'mobx';
import { Menu, Menus, Icon } from '../common';

class UserInfo extends React.Component {
  handleClick(friend, e) {
    const tagName = e.target.tagName;
    const { friend_id } = friend;
    if (tagName === 'IMG') {
      browserHistory.push(`/user-info/${friend_id}`);
    } else if (tagName === 'A') {
      browserHistory.push(`/chat/${friend_id}`);
    }
  }

  render() {
    const { friendsList } = this.props;
    const pathname = window.location.pathname
    return (
      <Menus label="我的好友" isSub={true} selected={true}>
        {
          toJS(friendsList).map(friend => (
            <Menu
              onClick={this.handleClick.bind(this, friend)}
              attachEl={
                <img src={friend.avatar}/>
              }
              isActive={parseInt(pathname.split('/').reverse()[0], 10) === friend.friend_id}
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
