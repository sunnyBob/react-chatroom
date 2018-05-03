import React from 'react';
import { browserHistory } from 'react-router';
import { Card, ModalManager, Table, Tab, TabItem, Icon } from '../common';
import request from '../../utils/request';
import commonUtils from '../../utils/commonUtils';
import { toast } from 'react-toastify';

import './invitation.less';

class Invitation extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      tbData: [],
      inviteType: '好友申请',
    };
    this.userId = JSON.parse(localStorage.getItem('user'))['user_id'];
  }

  componentDidMount() {
    this.fetchData();
  }

  componentWillReceiveProps() {
    this.fetchData();
  }

  fetchData = async () => {
    const groups = await commonUtils.getManageGroups(this.userId) || [];
    const groupIds = groups.map(group => group.id);
    const data = {
      friend_id: this.userId,
      invite_type: this.state.inviteType,
      groupIds: groupIds.join(','),
    };
    request({
      url: '/invitation',
      data,
    }).then(resp => {
      if (resp.code == 1) {
        this.setState({
          tbData: resp.retList,
        });
      }
    });
  }

  handleClose = () => {
    history.back();
  }

  handleToggle = (e) => {
    const inviteType = e.target.innerHTML;
    this.setState({
      inviteType,
    }, () => { this.fetchData(); });
  }

  handleAccept = (invitation) => {
    const { id, user_id, friend_id, username, invite_type, group_id } = invitation;
    if (invite_type === '好友申请') {
      commonUtils.isFriend(friend_id, user_id, {
        success: () => {
          toast.success(`${username}已经是您的好友`, toastOption);
          this.handleDeleteInvitation(invitation, () => {
            this.fetchData();
            this.props.fetchData && this.props.fetchData();
          });
        },
        fail: () => {
          request({
            url: '/friends',
            method: 'post',
            data: {
              userId: user_id,
              friendId: friend_id,
            },
          }).then(resp => {
            if (resp.code == 1) {
              toast.success(`成功添加${username}为好友`, toastOption);
              this.props.fetchData && this.props.fetchData();
              this.handleDeleteInvitation(invitation);
              socket.emit('updateLeftList', user_id);
            } else {
              toast.error('添加好友失败', toastOption);
            }
          });
        },
      });
    } else {
      commonUtils.isGroupMember(user_id, group_id, {
        success: () => {
          toast.success(`${username}已经在该群聊`, toastOption);
          this.handleDeleteInvitation(invitation, () => {
            this.fetchData();
            this.props.fetchData && this.props.fetchData();
          });
        },
        fail: () => {
          request({
            url: '/group/join',
            method: 'post',
            data: {
              userId: user_id,
              groupId: group_id,
            },
          }).then(resp => {
            if (resp.code === '1') {
              toast.success('加入群聊成功', toastOption);
              this.props.fetchData && this.props.fetchData();
              this.handleDeleteInvitation(invitation, () => {
              this.fetchData();
              this.props.fetchData && this.props.fetchData();
            });
              socket.emit('updateLeftList', user_id);
            } else {
              toast.error('加入群聊失败', toastOption);
            }
          });
        },
      });
    }
  }

  handleReject = (invitation) => {
    const { user_id, username, invite_type } = invitation;
    ModalManager.confirm({
      content: `确定拒绝${username}的${invite_type}？`,
      onOk: this.handleDeleteInvitation.bind(null, invitation, () => {
        toast.success(`您已成功拒绝${username}的${invite_type}`, toastOption);
        socket.emit('updateInvitation', user_id);
        this.fetchData();
        this.props.fetchData && this.props.fetchData();
      }),
    })
  }

  handleDeleteInvitation = async (invitation, cb = () => {}) => {
    const { user_id, friend_id } = invitation;
    await request({
      url: '/invitation',
      method: 'delete',
      data: {
        userId: user_id,
        friendId: friend_id,
      },
    }).then(resp => {
      if (resp.code == 1) {
        cb();
        return true;
      }
    });
  }

  render() {
    const columns = [
      { label: '申请人Id', field: 'user_id' },
      { label: '申请人姓名', field: 'username' },
      { label: '申请类型', field: 'invite_type' },
      { label: '申请时间', field: 'createTime' },
      {
        label: '操作', template: row => <span className="invitation-opt">
          <a onClick={this.handleAccept.bind(null, row)}>[接受] </a>
          <a onClick={this.handleReject.bind(null, row)}>[拒绝]</a>
        </span>
      },
    ];
    const data = this.state.tbData;
    const groupColumns = [...columns];
    groupColumns.splice(3, 0, {
      label: '群名称',
      field: 'group_name',
    });

    return (
      <div>
        <header className="detail-header">
          <p className="detail-header-title">申请列表</p>
          <Icon name="times" onClick={this.handleClose} />
        </header>
        <div className="invitation-btns">
          <a onClick={this.handleToggle} className="button is-primary is-small">好友申请</a>
          <a onClick={this.handleToggle} className="button is-info is-small">入群申请</a>
        </div>
        <Table
          data={data}
          columns={this.state.inviteType === '好友申请' ? columns : groupColumns}
          total={data.length}
          className="is-narrow"
          pagination={{
            current: 1,
            pageSize: 4,
            total: data.length,
            isShow: true,
            size: 'small',
            align: 'right',
            layout: 'total, pager, jumper',
          }}
        />
      </div>
    );
  }
}

export default Invitation;
