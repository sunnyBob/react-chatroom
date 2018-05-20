import React from 'react';
import { browserHistory, Link } from 'react-router';
import { toJS } from 'mobx';
import GroupDetail from './groupDetail'
import { Menu, Menus, Icon, ModalManager } from '../common';
import request from '../../utils/request';
import { toast } from 'react-toastify';

class GroupList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      showMsgIcon: null,
    };

    this.user = localStorage.getItem('user');
  }

  componentDidMount() {
    socket.on('chatToMore', (msg, userId, groupId, avatar) => {
      const pathname = window.location.pathname;
      const pathId = pathname.split('/').reverse()[0];
      const path = pathname.split('/').reverse()[1];
      if (this.user.user_id != userId && pathId != groupId) {
        this.setState({
          showMsgIcon: groupId,
        });
      }
    }); 
  }

  handleClick(group, e) {
    const tagName = e.target.tagName;
    const { id } = group;
    if (tagName !== 'IMG') {
      this.setState({ showMsgIcon: null }, () => {
        browserHistory.push(`/group-chat/${id}`);
      });
    }
  }

  handleRemoveGroup = (groupId) => {
    this.userId = JSON.parse(localStorage.getItem('user'))['user_id'];
    const modal = ModalManager.confirm({
      content: '确定要解散该群吗？',
      onOk: () => {
        request({
          url: '/delgroup',
          method: 'delete',
          data: {
            groupId,
          },
        }).then(resp => {
          ModalManager.close(modal);
          ModalManager.close(this.groupModal);
          if (resp.code === '1') {
            toast.success('解散成功', toastOption);
            socket.emit('updatePersonGroupList', this.userId);
            browserHistory.push('/chat');
          } else {
            toast.error('解散失败', toastOption);
          }
        });
      }
    });
  }

  viewDetail(group) {
    this.groupModal = ModalManager.open({
      content: <GroupDetail groupId={group.id} handleRemoveGroup={this.handleRemoveGroup}/>,
      showHeader: false,
      showFooter: false,
      height: 500,
      width: 725,
      wrapClass: 'group-detail-modal',
    });
  }

  render() {
    const { groupList, label } = this.props;
    const showMsgIcon = this.state.showMsgIcon;
    const pathname = window.location.pathname;
    const pathId = pathname.split('/').reverse()[0];
    const path = pathname.split('/').reverse()[1];
    return (
      <Menus label={label} isSub={true}>
        {
          toJS(groupList).map(group => (
            <Menu
              onClick={this.handleClick.bind(this, group)}
              attachEl={
                <span className="avatar-wrap column is-3" onClick={this.viewDetail.bind(this, group)}><img src={group.group_avatar} className="avatar"/></span>
              }
              isActive={pathId == group.id && path === 'group-chat'}
              key={group.id}
              className="columns is-gapless group-item"
            >
              { showMsgIcon == group.id && !(parseInt(pathId, 10) === group.id && path === 'group-chat') && <audio autoPlay src="/src/music/QQ_msg.mp3"/> }
              <span className="column">{group.group_name}</span>
              { showMsgIcon == group.id && !(parseInt(pathId, 10) === group.id && path === 'group-chat') && <Icon name="comment" className="column is-1"/> }
            </Menu>
          ))
        }
      </Menus>
    );
  }
}

export default GroupList;
