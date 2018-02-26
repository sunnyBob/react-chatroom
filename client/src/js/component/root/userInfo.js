import React from 'react';
import { browserHistory } from 'react-router';
import { Icon, PopoverManager, Dropdown } from '../common';
import AddUserGroup from './addUserOrGroup';

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
      const popover = PopoverManager.open({
        x: e.pageX,
        y: e.pageY,
        content: <AddUserGroup onClose={() => {
          PopoverManager.close(popover);
        }}/>,
      });
    }
  }

  render() {
    const { info } = this.props;
    return (
      <div className="user-info" onClick={this.handleClick}>
        <span className="avatar-wrap" data-status={info.status}>
          <img src={info.avatar || ''} className="avatar" />
        </span>
        <Icon name="user-plus" className="add-user"/>
      </div>
    );
  }
}

export default UserInfo;
