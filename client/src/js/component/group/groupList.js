import React from 'react';
import { browserHistory, Link } from 'react-router';
import { toJS } from 'mobx';
import GroupDetail from './groupDetail'
import { Menu, Menus, Icon, ModalManager } from '../common';
import request from '../../utils/request';

class GroupList extends React.Component {
  handleClick(group, e) {
    const tagName = e.target.tagName;
    const { id } = group;
    if (tagName === 'A') {
      browserHistory.push(`/group-chat/${id}`);
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
            socket.emit('updateMyGroupList', this.userId);
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
    const pathname = window.location.pathname;
    return (
      <Menus label={label} isSub={true}>
        {
          toJS(groupList).map(group => (
            <Menu
              onClick={this.handleClick.bind(this, group)}
              attachEl={
                <span className="avatar-wrap" onClick={this.viewDetail.bind(this, group)}><img src={group.group_avatar} className="avatar"/></span>
              }
              isActive={parseInt(pathname.split('/').reverse()[0], 10) === group.id && pathname.split('/').reverse()[1] === 'group-chat'}
              key={group.id}
            >
              <span>{group.group_name}</span>
            </Menu>
          ))
        }
      </Menus>
    );
  }
}

export default GroupList;
