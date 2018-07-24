import React from 'react';
import { browserHistory, Link } from 'react-router';
import { toJS } from 'mobx';
import { Menu, Menus, Icon } from '../common';

class FriendList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      showMsgIcon: null,
    };
  }

  componentDidMount() {
    socket.on('chatToOne', (msg, userId) => {
      const pathname = window.location.pathname;
      const pathId = pathname.split('/').reverse()[0];
      const path = pathname.split('/').reverse()[1];
      if (!(pathId == userId && path === 'chat')) {
        this.setState({
          showMsgIcon: userId,
        });
      }
    }); 
  }

  handleClick(friend, e) {
    const tagName = e.target.tagName;
    const { id } = friend;
    if (tagName === 'IMG') {
      browserHistory.push(`/user-info/${id}`);
    } else {
      this.setState({ showMsgIcon: null }, () => {
        browserHistory.push(`/chat/${id}`);
      });
    }
  }

  render() {
    const { friendsList = [] } = this.props;
    const showMsgIcon = this.state.showMsgIcon;
    const pathname = window.location.pathname;
    const pathId = pathname.split('/').reverse()[0];
    const path = pathname.split('/').reverse()[1];
    return (
      <Menus label={t('My Friends')} isSub={true} selected={true}>
        {
          toJS(friendsList).map(friend => (
            <Menu
              onClick={this.handleClick.bind(this, friend)}
              attachEl={
                <span className="avatar-wrap" data-status={friend.status}><img src={friend.avatar} className="avatar"/></span>
              }
              isActive={parseInt(pathId, 10) === friend.id && path === 'chat'}
              key={friend.id}
            >
              {showMsgIcon == friend.id && !(parseInt(pathId, 10) === friend.id && path === 'chat') && <audio autoPlay src="/src/music/QQ_msg.mp3"/>}
              {friend.username}
              {showMsgIcon == friend.id && !(parseInt(pathId, 10) === friend.id && path === 'chat') && <Icon name="comment"/>}
            </Menu>
          ))
        }
      </Menus>
    );
  }
}

export default FriendList;
