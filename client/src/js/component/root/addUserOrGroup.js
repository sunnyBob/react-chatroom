import React from 'react';
import { Input } from '../common';
import request from '../../utils/request';

import './root.less';

class AddUsrGroup extends React.Component {
  handleSearch = () => {
    
  }

  render() {
    return (
      <div>
        <h3>添加好友/群</h3>
        <Input placeholder="请输入id"/>
        <div>
          <button onClick={this.handleSearch}>查找好友</button>
          <button onClick={this.handleSearch}>查找群</button>
        </div>
        <div className="result">
          <span>tom j</span><button className="button">添加</button>
        </div>
      </div>
    );
  }
}

export default AddUsrGroup;
