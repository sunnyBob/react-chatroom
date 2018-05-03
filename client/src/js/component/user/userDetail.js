import React from 'react';
import { browserHistory } from 'react-router';
import { inject, observer } from 'mobx-react';
import Cropper from 'cropperjs';
import { Card, ModalManager, AttrList, Icon } from '../common';
import request from '../../utils/request';
import commonUtils from '../../utils/commonUtils';
import UploadAvatar from './uploadAvatar';
import ModifyPasswd from './modifyPasswd';
import { toast } from 'react-toastify';

import './user.less';

@inject('RootStore')
@observer
class UserDetail extends React.Component {
  constructor(props) {
    super(props);

    this.store = new props.RootStore();
    this.userId = JSON.parse(localStorage.getItem('user'))['user_id'];
  }

  componentDidMount() {
    const id = this.props.params.id;
    if (this.userId == id) {
      this.store.getUser(id);
    } else {
      id && commonUtils.isFriend(this.userId, id, {
        success: () => {
          this.store.getUser(id);
        },
        fail: () => {
          browserHistory.push('/');
        },
      });
    }
  }

  componentWillReceiveProps(nextProps) {
    const id = nextProps.params.id;
    if (this.userId == id) {
      this.store.getUser(id);
    } else {
      id && commonUtils.isFriend(this.userId, id, {
        success: () => {
          this.store.getUser(id);
        },
        fail: () => {
          browserHistory.push('/');
        },
      });
    }
  }

  handleClose = () => {
    history.back();
  }

  handleUpload = () => {
    const modal = ModalManager.open({
      content: <UploadAvatar ref={ref => { this.imagePicker = ref; }}/>,
      showHeader: false,
      onOk: () => handleOk.call(this),
    });
    function handleOk() {
      const avatar = this.imagePicker.state.previewUrl || this.imagePicker.img.src;
      if (avatar) {
        request({
          url: '/user',
          method: 'PUT',
          data: {
            id: this.props.params.id,
            avatar,
          },
        }).then(resp => {
          if (resp.code == 1) {
            this.props.fetchData && this.props.fetchData();
            ModalManager.close(modal);
          } else {
            toast.error('头像上传失败', toastOption);
          }
        });
      } else {
        ModalManager.close(modal);
      }
    }
  }

  modPasswd = () => {
    ModalManager.open({
      title: <small>密码修改</small>,
      content: <ModifyPasswd ref={(ref) => { this.passwdMpdal = ref; }}/>,
      onOk: () => handleOk.call(this),
    });
    function handleOk() {
      const { originPasswd, nowPasswd, confirmPasswd } = this.passwdMpdal.state;

      if (originPasswd !== confirmPasswd) {
        toast.error("两次输入的新密码不一致", toastOption);
      }
      if (originPasswd && nowPasswd) {
        const user = {
          originPasswd,
          name: this.store.userInfo.username,
          id: this.props.params.id,
          password: nowPasswd,
        };
        request({
          url: '/user',
          method: 'PUT',
          data: user,
        }).then(resp => {
          if (resp.code == 1) {
            toast.success('密码修改成功', toastOption);
          } else {
            toast.error("密码修改失败", toastOption);
          }
        });
      } else {
        toast.success('原始/新密码不能为空', toastOption);
      }
    }
  }

  handleEdit = (user, cb) => {
    user.id = this.props.params.id;
    request({
      url: '/user',
      method: 'PUT',
      data: user,
    }).then(resp => {
      if (resp.code == 1) {
        if (user.hasOwnProperty('username')) {
          this.props.fetchData && this.props.fetchData();
        } else {
          this.store.getUser(this.props.params.id);
        }
        cb();
      } else {
        toast.error("failed", toastOption);
      }
    })
  }

  handleChat = () => {
    browserHistory.push(`/chat/${this.props.params.id}`);
  }

  handleDelFriend = () => {
    ModalManager.confirm({
      content: '确定删除该好友？',
      onOk: this.handleOkDelFriend,
    })
  }

  handleOkDelFriend = async () => {
    await request({
      url: '/friends',
      method: 'delete',
      data: {
        friendId: this.props.params.id,
        userId: this.userId,
      },
    }).then(resp => {
      if (resp.code == 1) {
        toast.success('成功删除好友', toastOption);
        this.props.fetchData && this.props.fetchData();
        socket.emit('updateLeftList', this.props.params.id);
        return true;
      }
    });
  }

  render() {
    const { userInfo = {} } = this.store;
    const editable = userInfo.id === this.userId;
    const attrList = [{
      label: 'ID',
      field: 'ID',
      value: userInfo.id,
    }, {
      label: t('User Name'),
      field: 'username',
      value: userInfo.username,
      // editable,
    }, {
      label: t('Sex'),
      field: 'sex',
      value: t(userInfo.sex),
    }, {
      label: t('Age'),
      field: 'age',
      value: userInfo.age,
      editable,
    }, {
      label: t('Email'),
      field: 'email',
      value: userInfo.email,
      editable,
    }, {
      label: t('Phone'),
      field: 'phone',
      value: userInfo.phone,
      editable,
    }, {
      label: t('Signature'),
      field: 'signature',
      value: userInfo.signature,
      colSpan: 3,
      editable,
    }, {
      label: t('More Options'),
      value: (
        <div className="options">
          {userInfo.id === this.userId && <span onClick={this.modPasswd}>密码修改</span>}
          {userInfo.id === this.userId && <span onClick={this.handleUpload}>头像上传</span>}
          {userInfo.id !== this.userId && <span onClick={this.handleDelFriend}>删除好友</span>}
          {userInfo.id !== this.userId && <span onClick={this.handleChat}>发消息</span>}
        </div>
      ),
      colSpan: 3,
    }];
    return (
      <div>
        <header className="detail-header">
          <p className="detail-header-title">个人主页</p>
          <Icon name="times" onClick={this.handleClose}/>
        </header>
        <div className="info-top">
          <img src={userInfo.avatar}/>
        </div>
        <AttrList attrList={attrList} handleEdit={this.handleEdit}/>
      </div>
    );
  }
}

export default UserDetail;
