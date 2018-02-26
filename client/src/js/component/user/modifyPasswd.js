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
        <Input label="原密码" name="originPasswd" handleChange={this.handleChange}/>
        <Input label="新密码" name="nowPasswd" handleChange={this.handleChange}/>
      </div>
    );
  }
}
