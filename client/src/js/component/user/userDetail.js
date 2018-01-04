import React from 'react';
import { browserHistory } from 'react-router'
import Cropper from 'cropperjs';
import { Card, ModalManager } from '../common'
import UploadAvatar from './uploadAvatar';

import './user.less';

class UserDetail extends React.Component {
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
    return (
      <Card
        title="个人主页"
        enableClose={true}
        handleClose={this.handleClose}
      >
        hello user
        <button className="button" onClick={this.handleUpload}>upload</button>
      </Card>
    );
  }
}

export default UserDetail;
