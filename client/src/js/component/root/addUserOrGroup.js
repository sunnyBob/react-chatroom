import React from 'react';
import ReactDOM from 'react-dom';
import { Icon } from '../common';
import request from '../../utils/request';

import './addUserOrGroup.less';

class AddUsrGroup extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      result: {},
    };
    this.userId = JSON.parse(localStorage.getItem('user'))['user_id'];
  }

  handleSearch = (e) => {
    const id = ReactDOM.findDOMNode(this.input).value;
    if (!id) {
      alert("请输入id后再进行查找");
      return;
    }
    const name = e.target.name;
    if (name === 'user') {
      request({
        url: '/user',
        data: {
          id,
        }
      }).then(resp => {
        if (Array.isArray(resp.retList) && resp.retList.length) {
          this.setState({
            result: resp.retList[0],
          })
        }
      })
    } else if (name === 'group') {

    }
  }

  clear = (e) => {
    this.input.value = '';
    this.setState({ result: {} });
  }

  render() {
    const { avatar, username } = this.state.result;
    return (
      <div className="adduserorgroup">
        <h5>添加好友/群</h5>
        <div className="field">
          <p className="control has-icons-left has-icons-right">
            <input placeholder="请输入id" className="input is-small is-info search" name="userId" ref={ref =>{ this.input = ref }}/>
            <Icon name="search" className="is-left"/>
            <Icon name="close" className="is-right" onClick={this.clear}/>
          </p>
        </div>
        <div className="search-btn">
          <button onClick={this.handleSearch} name="user" className="button is-small">查找好友</button>
          <button onClick={this.handleSearch} name="group" className="button is-small">查找群</button>
        </div>
        {
          Object.keys(this.state.result).length ? <div className="result">
            <div className="person">
              <img src={avatar} className="avatar"/>
              <span>{username}</span>
            </div>
            <button className="button is-info is-small">添加</button>
          </div> : null
        }
      </div>
    );
  }
}

export default AddUsrGroup;
