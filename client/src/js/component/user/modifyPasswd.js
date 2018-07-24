import React from 'react';
import { browserHistory } from 'react-router'
import { Input } from '../common'

import './user.less';

export default class extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      originPasswd: '',
      nowPasswd: '',
      confirmPasswd: '',
    }
  }

  handleChange = (name, value) => {
    this.setState({
      [name]: value,
    });
  }

  render() {
    return (
      <div>
        <Input label="原密码" type="password" name="originPasswd" handleChange={this.handleChange}/>
        <Input label="新密码" type="password" name="nowPasswd" handleChange={this.handleChange}/>
        <Input label="确认新密码" type="password" name="confirmPasswd" handleChange={this.handleChange}/>
      </div>
    );
  }
}
