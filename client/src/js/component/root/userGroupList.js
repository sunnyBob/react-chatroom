import React from 'react';
import { browserHistory, Link } from 'react-router';
import { toJS } from 'mobx';
import { Menu, Menus, Icon } from '../common';
import commonUtils from '../../utils/commonUtils';

class UserGroupList extends React.Component {
  handleClick(ug, e) {
    const tagName = e.target.tagName;
    const id = ug.group_name ? ug.group_id : ug.userId;
    let url = '';
    if (tagName === 'IMG') {
      url = ug.group_name ? `/group-info/${id}` : `/user-info/${id}`;
    } else if (tagName === 'A') {
      url = ug.group_name ? `/group-chat/${id}` : `/chat/${id}`;
    }
    browserHistory.push(url);
  }

  render() {
    const { list } = this.props;
    const pathname = window.location.pathname;
    this.user = JSON.parse(localStorage.getItem('user'));

    const el = list.length ? toJS(list).map(ug => (
      <Menu
        onClick={this.handleClick.bind(this, ug)}
        attachEl={
          <span className="avatar-wrap" data-status={ug.status}><img src={ug.group_avatar || ug.avatar} className="avatar"/></span>
        }
        isActive={parseInt(pathname.split('/').reverse()[0], 10) === (ug.group_name ? ug.group_id : ug.userId)}
        key={ug.group_name ? ug.group_id : ug.userId}
      >
        {ug.group_name || ug.username}
      </Menu>
    )) : <Menu><span>{t('未搜索到任何结果')}...</span></Menu>
    return (
      <Menus label={t('Search Result')} isSub={true} selected={true}>
        {el}
      </Menus>
    );
  }
}

export default UserGroupList;
