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
    
    this.selectedFriends = [];
    this.userId = JSON.parse(localStorage.getItem('user'))['user_id'];
  }

  handleCheck = (e) => {
    const { checked, name, id } = e.target;
    if (checked) {
      this.selectedFriends.push({name, id});
    } else {
      this.selectedFriends.some((oneId, index) => {
        if (oneId === id) {
          this.selectedFriends.splice(index, 1);
          return true;
        }
        return false;
      });
    }
    this.props.handleSelectedChange(this.selectedFriends);
  }

  render() {
    const data = this.props.friendsList || [];

    return (
      <ul className="friend-ul">
        {
          toJS(data).map(friend => (
            <li key={friend.id}>
              <span>
                <input type="checkbox" onChange={this.handleCheck} name={friend.username} id={friend.friend_id == this.userId ? friend.user_id.toString() : friend.friend_id.toString()}/>
              </span>
              <span className="avatar-wrap">
                <img src={friend.avatar} className="avatar"/>
              </span>
              <span>{friend.username}</span>
            </li>
          ))
        }
      </ul>
    );
  }
}

export default CreateGroup;
