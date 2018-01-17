import React from 'react';
import { browserHistory } from 'react-router'
import { Input } from '../common'

import './user.less';

export default class extends React.Component {
  render() {
    return (
      <div>
        <Input label="原密码"/>
        <Input label="新密码"/>
      </div>
    );
  }
}
