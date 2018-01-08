import React from 'react';
import { browserHistory } from 'react-router';
import { Icon, PopoverManager } from '../common';
import AddUserGroup from './addUserOrGroup';

const statusType = {
  0: 'offline',
  1: 'online',
};
class UserInfo extends React.Component {
  componentWillReceiveProps(nextProps) {
    if (this.props.info !== nextProps.info) {
      this.props = nextProps;
    }
  }

  handleClick = (e) => {
    const { info } = this.props;
    const { tagName, className } = e.target;
    if (tagName === 'IMG') {
      browserHistory.push(`/user-info/${info.id}`);
    } else if (className.indexOf('fa-user-plus') >= 0) {
      PopoverManager.open({
        x: e.pageX,
        y: e.pageY,
        content: <AddUserGroup/>,
      })
    }
  }

  render() {
    const { info } = this.props;
    const statusStyle = statusType[info.status] || '';
    return (
      <div className="user-info" onClick={this.handleClick}>
        <img src={info.avatar || ''} className="avatar"/>
        <Icon name="circle" className={`status ${statusStyle}`}/>
        <Icon name="user-plus" className="add-user"/>
      </div>
    );
  }
}

export default UserInfo;
