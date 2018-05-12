import React from 'react';
import { browserHistory, Link } from 'react-router';
import { toJS } from 'mobx';
import { Menu, Menus, Icon } from '../common';

class FriendList extends React.Component {
  handleClick(friend, e) {
    const tagName = e.target.tagName;
    const { id } = friend;
    if (tagName === 'IMG') {
      browserHistory.push(`/user-info/${id}`);
    } else if (tagName === 'A') {
      browserHistory.push(`/chat/${id}`);
    }
  }

  render() {
    const { friendsList = [] } = this.props;
    const pathname = window.location.pathname;
    return (
      <Menus label={t('My Friends')} isSub={true} selected={true}>
        {
          toJS(friendsList).map(friend => (
            <Menu
              onClick={this.handleClick.bind(this, friend)}
              attachEl={
                <span className="avatar-wrap" data-status={friend.status}><img src={friend.avatar} className="avatar"/></span>
              }
              isActive={parseInt(pathname.split('/').reverse()[0], 10) === friend.id && pathname.split('/').reverse()[1] === 'chat'}
              key={friend.id}
            >
              {friend.username}
            </Menu>
          ))
        }
      </Menus>
    );
  }
}

export default FriendList;
