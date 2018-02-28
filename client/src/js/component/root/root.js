import React from 'react';
import { inject, observer } from 'mobx-react';
import { Menu, Menus, Icon, Dropdown } from '../common';
import { browserHistory, Link } from 'react-router';
import request from '../../utils/request';
import UserInfo from './userInfo';
import FriendList from './friendList';
import '../../../local';

import './root.less';

const lang = ['zh', 'en'];
@inject('RootStore')
@observer
class Root extends React.Component {
  constructor(props) {
    super(props);
    
    this.lang_index = 0;
    this.user = JSON.parse(localStorage.getItem('user'));
    this.store = new props.RootStore();

    socket.on('updateLeftList', () => {
      this.fetchData();
    });
    socket.on('updateInvitation', () => {
      const id = this.user.user_id;
      console.log(id);
      id && this.store.getInvitation(id);
    });
    socket.on('updateStatus', userId => {
      this.store.friendsInfo.some(friend => {
        if(friend.friend_id == userId || friend.user_id == userId) {
          this.store.getFriends(this.user.user_id);
          return true;
        }
        return false;
      });
    });
  }

  componentDidMount() {
    this.user && this.fetchData();
  }

  fetchData = () => {
    const id = this.user.user_id;
    if (id) {
      this.store.getFriends(id);
      this.store.getUser(id);
      this.store.getInvitation(id);
    }
  }

  handleToggleLang = () => {
    this.lang_index = 1 - this.lang_index;
    i18next.changeLanguage(lang[this.lang_index], err => {
      if (!err) {
        browserHistory.replace(window.location.pathname);
      }
    });
  }

  handleSignOut = () => {
    request({
      url: '/signout',
      data: {},
    }).then(resp => {
      request({
        url: '/user',
        method: 'PUT',
        data: {
          status: 0,
          id: this.user.user_id,
        }
      }).then(resp => {
        if (resp.code == 1) {
          socket.emit('updateStatus', this.user.user_id);
          location.reload();
        }
      });
    });
  }

  handleAddGroup = () => {

  }

  render() {
    const items = [{
      content: t('Change Language'),
      icon: 'language',
      handleClick: this.handleToggleLang,
    }, {
      content: t('New Chat'),
      icon: 'users',
      handleClick: this.handleAddGroup,
    }, {
      content: t('Sign Out'),
      icon: 'sign-out',
      handleClick: this.handleSignOut,
    }];
    const child = React.Children.only(this.props.children);
    const cloneChild = React.cloneElement(child, { fetchData: this.fetchData });

    return (
      <div className="container is-fluid mainpage">
        <div className="columns" style={{height: '100%'}}>
          <div className="column is-2 menubox">
            <UserInfo info={this.store.userInfo}/>
            <input className="input"/>
            <Menus>
              <FriendList friendsList={this.store.friendsInfo}/>
              <Menus label={t('My Groups')} isSub={true}>
                <Menus label={t('Joined')} isSub={true}></Menus>
                <Menus label={t('Created')} isSub={true}></Menus>
                <Menus label={t('Managed')} isSub={true}></Menus>
              </Menus>
            </Menus>
          </div>
          <div className="column is-10">
            <div className="right-bar">
              <Dropdown
                align="right"
                items={items}
                triggerEl={<Icon name="cog"/>}
                hasDividers={true}
              />
              <Link to="/invitations"><Icon name="bell" className="alert-bell" data-bell={this.store.inviteCount}/></Link>
            </div>
            {cloneChild}
          </div>
        </div>
      </div>
    )
  }
}

export default Root;
