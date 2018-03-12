import React from 'react';
import { inject, observer } from 'mobx-react';
import { Menu, Menus, Icon, Dropdown, ModalManager, Card } from '../common';
import { browserHistory, Link } from 'react-router';
import request from '../../utils/request';
import UserInfo from './userInfo';
import FriendList from './friendList';
import GroupList from './groupList';
import { ToastContainer, toast } from 'react-toastify';
import CreateGroup from './createGroup';
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

    this.state = {
      selectedFriends: [],
    };
    socket.on('updateLeftList', () => {
      this.fetchData();
    });
    socket.on('updateInvitation', () => {
      const id = this.user.user_id;
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
    socket.on('updateGroupList', () => {
      this.user && this.fetchGroupData();
    });
  }

  componentDidMount() {
    this.user && this.fetchData();
    this.user && this.fetchGroupData();
  }

  fetchData = () => {
    const id = this.user.user_id;
    if (id) {
      this.store.getFriends(id);
      this.store.getUser(id);
      this.store.getInvitation(id);
    }
  }

  fetchGroupData() {
    const id = this.user.user_id;
    this.store.getCreateGroup(id);
    this.store.getManageGroup(id);
    this.store.getJoinedGroup(id);
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
    ModalManager.open({
      title: '创建群聊(选择群聊好友)',
      content: <CreateGroup friendsList={this.store.friendsInfo} handleSelectedChange={this.handleSelectedChange}/>,
      onOk: async () => {
        const selectedFriends = this.state.selectedFriends;
        const { user_id, user_name, avatar } = this.user;
        if (selectedFriends.length === 1) {
          browserHistory.push(`/chat/${selectedFriends[0].id}`);
          return;
        }
        const resp = await request({
          url: '/group',
          method: 'post',
          data: {
            selectedFriends,
            userId: user_id,
            userName: user_name,
            avatar,
          },
        });
        if (resp.code === '1') {
          toast.success('创建成功', toastOption);
          this.fetchGroupData();
          const ids = [...selectedFriends].map(user => user.id);
          socket.emit('createGroup', ids, resp.retList.insertId);
        } else {
          toast.error('创建失败', toastOption);
        }
      },
      okText: '创建',
    })
  }

  handleSelectedChange = (selectedFriends) => {
    this.setState({
      selectedFriends,
    });
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
        <ToastContainer/>
        <div className="columns" style={{height: '100%'}}>
          <div className="column is-3 menubox">
            <UserInfo info={this.store.userInfo}/>
            <input className="input"/>
            <Menus>
              <FriendList friendsList={this.store.friendsInfo}/>
              <Menus label={t('My Groups')} isSub={true} selected={true}>
                <GroupList groupList={this.store.joinedGroup} label={t('Joined')}/>
                <GroupList groupList={this.store.createGroup} label={t('Created')}/>
                <GroupList groupList={this.store.manageGroup} label={t('Managed')}/>
              </Menus>
            </Menus>
          </div>
          <Card className="column is-9" showHeader={false} showFooter={false}>
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
          </Card>
        </div>
      </div>
    )
  }
}

export default Root;
