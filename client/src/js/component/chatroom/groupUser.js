import React from 'react';
import { Link } from 'react-router';
import { inject, observer } from 'mobx-react';
import { ModalManager } from '../common';
import request from '../../utils/request';
import { toast } from 'react-toastify';
import CreateGroup from '../root/createGroup';

import './chatRoom.less';

@inject('RootStore')
@observer
export default class extends React.Component {
  constructor(props) {
    super(props);

    const user = localStorage.getItem('user');
    this.user = JSON.parse(user);
    this.store = new props.RootStore();

    this.state = { selectedFriends: [] };
  }

  componentDidMount() {
    this.fetchData();
  }

  componentWillReceiveProps() {
    this.fetchData();
  }

  fetchData = () => {
    this.store.getGroupUser('', this.props.groupId);
    this.store.getFriends(this.user.user_id, this.props.groupId);
  }

  handleSelectedChange = (selectedFriends) => {
    this.setState({
      selectedFriends,
    });
  }

  addGroupUser = () => {
    const groupId = this.props.groupId;
    ModalManager.open({
      title: '邀请好友',
      content: <CreateGroup
        friendsList={this.store.friendsInfo}
        handleSelectedChange={this.handleSelectedChange}
        groupId={groupId}
      />,
      onOk: async () => {
        const selectedFriends = this.state.selectedFriends;
        if (selectedFriends.length === 0) {
          return;
        }
        const resp = await request({
          url: '/group/invite',
          method: 'post',
          data: {
            users: selectedFriends.map(friend => friend.id),
            groupId: groupId
          },
        });
        if (resp.code === '1') {
          toast.success('邀请成功', toastOption);
          socket.emit('addToRoom', selectedFriends.map(friend => friend.id), groupId);
          socket.emit('updateGroupUser', groupId);
        } else {
          toast.error('邀请失败', toastOption);
        }
      },
      okText: '添加',
    });
  }

  renderUser = () => {
    return (
      <ul className="group-user-ul">
        {
          this.store.groupUser.map(user => (
            <li className="group-user-li" key={user.id}>
              <Link to={`/user-info/${user.id}`}><img className="avatar" src={user.avatar}/></Link>
              <div  className="name">
                {user.username}
              </div>
            </li>
          ))
        }
        <li  className="group-user-li" onClick={this.addGroupUser}>
          <img src="/src/images/add.png"/>
        </li>
      </ul>
    );
  }

  render() {
    return (
      <div className="group-user">
        {this.renderUser()}
      </div>
    )
  }
}
