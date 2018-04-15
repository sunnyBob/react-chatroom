import React from 'react';
import ReactDOM from 'react-dom';
import { toJS } from 'mobx';
import { Icon } from '../common';
import request from '../../utils/request';
import commonUtils from '../../utils/commonUtils';
import { toast } from 'react-toastify';

class CreateGroup extends React.Component {
  constructor(props) {
    super(props);
    
    this.state = {
      selectedFriends: [],
    };
    this.userId = JSON.parse(localStorage.getItem('user'))['user_id'];
  }

  handleCheck = (e) => {
    const { checked, name, id } = e.target;
    const selectedFriends = [...this.state.selectedFriends];
    if (checked) {
      selectedFriends.push({name, id});
    } else {
      selectedFriends.some((friend, index) => {
        if (friend.id === id) {
          selectedFriends.splice(index, 1);
          return true;
        }
        return false;
      });
    }

    this.setState({
      selectedFriends,
    }, () => {
      this.props.handleSelectedChange(this.state.selectedFriends);
    });
  }

  render() {
    const data = this.props.friendsList || [];
    const groupId = this.props.groupId;
    return (
      <ul className="friend-ul">
        {
          toJS(data).length ? toJS(data).map(friend => (
            <li key={friend.id} style={{background: friend.group_id == groupId ? '#f0f0f0' : ''}}>
              <span>
                <input type="checkbox" disabled={friend.group_id == groupId} onChange={this.handleCheck} name={friend.username} id={friend.friend_id == this.userId ? friend.user_id.toString() : friend.friend_id.toString()}/>
              </span>
              <span className="avatar-wrap">
                <img src={friend.avatar} className="avatar"/>
              </span>
              <span>{friend.username}</span>
            </li>
          )) : (
            <li>暂无数据</li>
          )
        }
      </ul>
    );
  }
}

export default CreateGroup;
