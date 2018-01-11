import React from 'react';
import { inject, observer } from 'mobx-react';
import { Menu, Menus, Icon } from '../common';
import { browserHistory } from 'react-router';
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
    const user = localStorage.getItem('user');
    this.user = JSON.parse(user);
    this.store = new props.RootStore();
    this.fetchData();
  }

  fetchData = () => {
    this.store.getFriends(this.user.user_id);
    this.store.getUser(this.user.user_id);
  }
  handleToggleLang = () => {
    this.lang_index = 1 - this.lang_index;
    i18next.changeLanguage(lang[this.lang_index], err => {
      if (!err) {
        browserHistory.replace(window.location.pathname);
      }
    });
  }

  render() {
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
            <div className="topbar">
              <Icon name="language" className="icon-lang" onClick={this.handleToggleLang}/>
            </div>
            {this.props.children}
          </div>
        </div>
      </div>
    )
  }
}

export default Root;
