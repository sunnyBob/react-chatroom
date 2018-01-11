import React from 'react';
import { browserHistory } from 'react-router'
import { inject, observer } from 'mobx-react';
import Cropper from 'cropperjs';
import { Card, ModalManager, AttrList } from '../common'
import UploadAvatar from './uploadAvatar';

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
    const attrList = [{
      label: 'ID',
      value: userInfo.id,
    }, {
      label: t('User Name'),
      value: userInfo.username,
    }, {
      label: t('Sex'),
      value: t(userInfo.sex),
    }, {
      label: t('Age'),
      value: userInfo.age,
    }, {
      label: t('Email'),
      value: userInfo.email,
    }, {
      label: t('Phone'),
      value: userInfo.phone,
    }, {
      label: t('Signature'),
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
        <AttrList attrList={attrList}/>
        <button className="button" onClick={this.handleUpload}>upload</button>
      </Card>
    );
  }
}

export default UserDetail;
