import React from 'react';
import { browserHistory } from 'react-router';
import { Icon, PopoverManager } from '../common';
import AddUserGroup from './addUserOrGroup';

class UserInfo extends React.Component {
  componentWillReceiveProps(nextProps) {
    if (this.props.info !== nextProps.info) {
      this.props = nextProps;
    }
  }

  handleClick = (e) => {
    const tagName = e.target.tagName;
    const { info } = this.props;
    if (tagName === 'IMG') {
      browserHistory.push(`/user-info/${info.user_id}`);
    } else if (tagName === 'I') {
      PopoverManager.open({
        x: e.pageX,
        y: e.pageY,
        content: <AddUserGroup/>,
      })
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
