import React from 'react';
import { browserHistory, Link } from 'react-router';
import { toJS } from 'mobx';
import GroupDetail from './groupDetail'
import { Menu, Menus, Icon, ModalManager } from '../common';

class GroupList extends React.Component {
  handleClick(group, e) {
    const tagName = e.target.tagName;
    const { id } = group;
    if (tagName === 'A') {
      browserHistory.push(`/group-chat/${id}`);
    }
  }

  viewDetail(group) {
    ModalManager.open({
      content: <GroupDetail group={group}/>,
      showHeader: false,
      showFooter: false,
      height: 500,
      width: 725,
      wrapClass: 'group-detail-modal',
    });
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
                <span className="avatar-wrap column" onClick={this.viewDetail.bind(this, group)}><img src={group.group_avatar} className="avatar"/></span>
              }
              isActive={parseInt(pathname.split('/').reverse()[0], 10) === group.id && pathname.split('/').reverse()[1] === 'group-chat'}
              key={group.id}
              className="columns is-gapless"
            >
              <span className="column is-8">{group.group_name}</span>
              <span className="column is-1"><i className="fa fa-comment"></i></span>
            </Menu>
          ))
        }
      </Menus>
    );
  }
}

export default GroupList;
