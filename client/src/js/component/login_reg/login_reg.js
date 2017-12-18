import React from 'react';
import { Tab, TabItem, Input, RadioGroup } from '../common';
import { browserHistory } from 'react-router';
import request from '../../utils/request';

export default class LoginReg extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      name: '',
      passwd: '',
    };
  }

  handleLogin = async () => {
    const { name, passwd } = this.state;
    const ret = await request({
      url: 'login',
      data: {
        name,
        passwd,
        username: '',
        password: '',
        repassword: '',
        age: 0,
        sex: '',
        email: '',
        phone: '',
      },
    });
    if (ret.code === 1) {
      browserHistory.replace('/chat');
    }
  }

  handleChange = (name, value) => {
    this.setState({
      [name]: value,
    })
  }

  render() {
    return (
      <div className="login-container">
        <div className="card login">
          <Tab
            isCenter={true}
          >
            <TabItem icon='sign-in' content="登录">
              <div className="content">
                <Input
                  placeholder="username"
                  label="Username"
                  name="name"
                  required={true}
                  handleChange={this.handleChange}
                />
                <Input
                  placeholder="password"
                  label="Password"
                  type="password"
                  name="passwd"
                  required={true}
                  handleChange={this.handleChange}
                />
                <a className="button is-primary is-small pull-right" onClick={this.handleLogin}>登录</a>
              </div>
            </TabItem>
            <TabItem icon='registered' content="注册">
              <div className="content">
                <Input
                  placeholder="username"
                  label="Username"
                  name="username"
                  required={true}
                  handleChange={this.handleChange}
                />
                <Input
                  placeholder="password"
                  label="Password"
                  type="password"
                  name="password"
                  required={true}
                  handleChange={this.handleChange}
                />
                <Input
                  placeholder="password again"
                  label="Password again"
                  type="password"
                  name="repassword"
                  required={true}
                  handleChange={this.handleChange}
                />
                <Input
                  placeholder="age"
                  label="Age"
                  type="number"
                  name="age"
                  handleChange={this.handleChange}
                />
                <RadioGroup
                  label="sex"
                  name="sex"
                  options={[{
                    label: 'male',
                    value: '男'
                  }, {
                    label: 'female',
                    value: '女'
                  }]}
                  onChange={this.handleChange}
                />
                <Input
                  placeholder="phone"
                  label="Phone"
                  name="phone"
                  handleChange={this.handleChange}
                />
                <Input
                  placeholder="email"
                  label="Email"
                  name="email"
                  handleChange={this.handleChange}
                />
                <a className="button is-primary is-small pull-right">注册</a>
              </div>
            </TabItem>
          </Tab>
        </div>
      </div>
    );
  }
};
