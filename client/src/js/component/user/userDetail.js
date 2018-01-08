import React from 'react';
import { browserHistory } from 'react-router'
import { inject, observer } from 'mobx-react';
import Cropper from 'cropperjs';
import { Card, ModalManager } from '../common'
import UploadAvatar from './uploadAvatar';

import './user.less';

@inject('RootStore')
@observer
class UserDetail extends React.Component {
  constructor(props) {
    super(props);

    this.store = new props.RootStore();
  }

  componentDidMount() {
    this.store.getUser(this.props.params.id);
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
    console.log(this.store);
    return (
      <Card
        title="个人主页"
        enableClose={true}
        handleClose={this.handleClose}
        className="person-info"
      >
        <div>
          <img src={userInfo.avatar}/>
        </div>
        <button className="button" onClick={this.handleUpload}>upload</button>
      </Card>
    );
  }
}

export default UserDetail;
