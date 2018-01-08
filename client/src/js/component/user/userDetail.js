import React from 'react';
import { browserHistory } from 'react-router'
import { inject, observer } from 'mobx-react';
import Cropper from 'cropperjs';
import { Card, ModalManager } from '../common'
import UploadAvatar from './uploadAvatar';
import Attr from './attr';

import './user.less';

@inject('RootStore')
@observer
class UserDetail extends React.Component {
  constructor(props) {
    super(props);

    this.store = new props.RootStore();
  }

  componentWillMount() {
    this.store.getUser(this.props.params.id);
  }

  componentWillReceiveProps(nextProps) {
    this.store.getUser(nextProps.params.id);
  }

  handleClose = () => {
    browserHistory.push('/chat');
  }

  handleUpload = () => {
    ModalManager.open({
      content: <UploadAvatar/>,
      showHeader: false,
    })
  }

  render() {
    const { userInfo = {} } = this.store;
    console.log(userInfo);
    const attrList = [{
      label: '用户名',
      value: userInfo.username,
    }, {
      label: '性别',
      value: userInfo.username,
    }, {
      label: '年龄',
      value: userInfo.age,
    }, {
      label: '邮箱',
      value: userInfo.email,
    }, {
      label: '手机',
      value: userInfo.phone,
    }, {
      label: '个性签名',
      value: userInfo.signature,
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
        <Attr attrList={attrList}/>
        <button className="button" onClick={this.handleUpload}>upload</button>
      </Card>
    );
  }
}

export default UserDetail;
