import React from 'react';
import { browserHistory } from 'react-router';
import { Icon } from '../common';

class UserInfo extends React.Component {
  componentWillReceiveProps(nextProps) {
    if (this.props.info !== nextProps.info) {
      this.props = nextProps;
    }
  }

  handleClick = (e) => {
    const tagName = e.target.tagName;
    if (tagName === 'IMG') {
      browserHistory.push('/user-info');
    } else if (tagName === 'I') {
      browserHistory.push('/user-add');
    }
  }

  render() {
    const { info } = this.props;
    return (
      <div className="user-info" onClick={this.handleClick}>
        <img src={info.avatar || ''} className="avatar"/>
        <Icon name="user-plus" className="add-user"/>
      </div>
    );
  }
}

export default UserInfo;
