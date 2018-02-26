import React from 'react';
import { browserHistory } from 'react-router'
import { inject, observer } from 'mobx-react';
import Cropper from 'cropperjs';
import { Card, ModalManager, AttrList } from '../common';
import request from '../../utils/request';
import UploadAvatar from './uploadAvatar';
import ModifyPasswd from './modifyPasswd';

import './user.less';

@inject('RootStore')
@observer
class UserDetail extends React.Component {
  constructor(props) {
    super(props);

    this.store = new props.RootStore();
    this.userId = JSON.parse(localStorage.getItem('user'))['user_id'];
  }

  componentWillMount() {
    this.store.getUser(this.props.params.id);
  }

  componentWillReceiveProps(nextProps) {
    this.store.getUser(nextProps.params.id);
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
          if (resp.code === 1) {
            this.props.fetchData && this.props.fetchData();
            ModalManager.close(modal);
          } else {
            alert("failed");
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
      const { originPasswd, nowPasswd } = this.passwdMpdal.state;
      if (originPasswd && originPasswd) {
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
          if (resp.code === 1) {
            alert('success');
          } else {
            alert("failed");
          }
        });
      } else {
        alert('原始/新密码不能为空');
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
      if (resp.code === 1) {
        if (user.hasOwnProperty('username')) {
          this.props.fetchData && this.props.fetchData();
        } else {
          this.store.getUser(this.props.params.id);
        }
        cb();
      } else {
        alert("failed");
      }
    })
  }

  handleChat = () => {
    browserHistory.push(`/chat/${this.props.params.id}`);
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
      editable,
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
          {userInfo.id !== this.userId && <span onClick={this.handleChat}>发消息</span>}
        </div>
      ),
      colSpan: 3,
    }]
    return (
      <Card
        title="个人主页"
        enableClose={true}
        handleClose={this.handleClose}
        className="person-info"
      >
        <div className="info-top">
          <img src={userInfo.avatar}/>
        </div>
        <AttrList attrList={attrList} handleEdit={this.handleEdit}/>
      </Card>
    );
  }
}

export default UserDetail;
