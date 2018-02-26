import React from 'react';
import { browserHistory } from 'react-router'
import { Card, ModalManager, Table, Tab, TabItem } from '../common';
import request from '../../utils/request';

import './invitation.less';

class Invitation extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      inviteType: '好友申请',
      tbData: [],
    };
    console.log(props);
    this.userId = JSON.parse(localStorage.getItem('user'))['user_id'];
  }

  componentDidMount() {
    this.fetchData();
  }

  fetchData = () => {
    request({
      url: '/invitation',
      data: {
        friend_id: this.userId,
        invite_type: this.state.inviteType,
      },
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
    const { id, user_id, friend_id, username, invite_type } = invitation;
    if (invite_type === '好友申请') {
      request({
        url: '/friends',
        method: 'post',
        data: {
          userId: user_id,
          friendId: friend_id,
        },
      }).then(resp => {
        if (resp.code == 1) {
          alert(`成功添加${username}为好友`);
          this.props.fetchData && this.props.fetchData();
          this.handleDeleteInvitation(id);
        } else {
          alert(`添加好友失败`);
        }
      });
    }
  }

  handleReject = (invitation) => {
    const { id, username } = invitation;
    ModalManager.confirm({
      content: `确定拒绝${username}的好友申请？`,
      onOk: this.handleDeleteInvitation.bind(null, id, () => {
        alert(`您已拒绝${username}的好友申请`);
        this.fetchData();
      }),
    })
  }

  handleDeleteInvitation = (id, cb = () => {}) => {
    request({
      url: '/invitation',
      method: 'delete',
      data: {
        id,
      },
    }).then(resp => {
      if (resp.code == 1) {
       cb();
      }
    });
  }

  render() {
    const columns = [
      { label: '申请人Id', field: 'user_id' },
      { label: '申请人姓名', field: 'username' },
      { label: '申请类型', field: 'invite_type' },
      { label: '申请时间', field: 'createTime' },
      { label: '操作', template: row => <span className="invitation-opt">
        <a onClick={this.handleAccept.bind(null, row)}>[接受] </a>
        <a onClick={this.handleReject.bind(null, row)}>[拒绝]</a>
      </span> },
    ];
    const data = this.state.tbData;
    return (
      <Card
        title="申请列表"
        enableClose={true}
        handleClose={this.handleClose}
        className="person-info"
      >
        <div className="invitation-btns">
          <a onClick={this.handleToggle} className="button is-primary is-small">好友申请</a>
          <a onClick={this.handleToggle} className="button is-info is-small">入群申请</a>
        </div>
        <Table
          data={data}
          columns={columns}
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
      </Card>
    );
  }
}

export default Invitation;
