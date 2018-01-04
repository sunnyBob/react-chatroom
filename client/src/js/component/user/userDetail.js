import React from 'react';
import { browserHistory } from 'react-router'
import { Card } from '../common'

class UserDetail extends React.Component {
  handleClose = () => {
    browserHistory.push('/chat');
  }

  render() {
    return (
      <Card
        title="个人主页"
        enableClose={true}
        handleClose={this.handleClose}
      >
        hello user
      </Card>
    );
  }
}

export default UserDetail;
