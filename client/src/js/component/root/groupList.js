import React from 'react';
import { browserHistory, Link } from 'react-router';
import { toJS } from 'mobx';
import { Menu, Menus, Icon } from '../common';

class GroupList extends React.Component {
  handleClick(group, e) {
    const tagName = e.target.tagName;
    const { id } = group;
    if (tagName === 'IMG') {
      browserHistory.push(`/group-info/${id}`);
    } else if (tagName === 'A') {
      browserHistory.push(`/group-chat/${id}`);
    }
  }

  render() {
    const { groupList, label } = this.props;
    const pathname = window.location.pathname
    return (
      <Menus label={label} isSub={true}>
        {
          toJS(groupList).map(group => (
            <Menu
              onClick={this.handleClick.bind(this, group)}
              attachEl={
                <span className="avatar-wrap"><img src={group.group_avatar} className="avatar"/></span>
              }
              isActive={parseInt(pathname.split('/').reverse()[0], 10) === group.id}
              key={group.id}
            >
              {group.group_name}
            </Menu>
          ))
        }
      </Menus>
    );
  }
}

export default GroupList;
