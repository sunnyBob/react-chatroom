import React from 'react';
import { Tab, TabItem, Input, RadioGroup } from '../common';
import { browserHistory } from 'react-router';
import request from '../../utils/request';
import { toast } from 'react-toastify';
import { ToastContainer } from 'react-toastify';
import './loginReg.less';

export default class LoginReg extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      name: '',
      passwd: '',
      username: '',
      password: '',
      repassword: '',
      age: 0,
      sex: null,
      email: null,
      phone: null,
    };
  }

  updateStatus = (userId) => {
    request({
      url: '/user',
      method: 'PUT',
      data: {
        status: 1,
        id: userId,
      }
    }).then(resp => {
      if (resp.code == 1) {
        socket.emit('updateStatus', userId);
      }
    })
  }

  handleLogin = async () => {
    const { name, passwd } = this.state;
    const ret = await request({
      url: '/login',
      data: {
        name,
        passwd,
      },
    });
    if (ret.code == 1) {
      const { userId, userName, avatar } = ret.retList[0] || {};
      const user = {
        user_id: userId,
        user_name: userName,
        avatar,
      };
      localStorage.setItem('user', JSON.stringify(user));
      this.updateStatus(userId);
      socket.emit('login', userId);
      browserHistory.replace('/chat');
    }
  }

  handleReg = async () => {
    const { username, password, repassword, age, phone, email, sex } = this.state;
    if (password !== repassword) {
      toast.error('两次输入密码不一致', toastOption);
      return;
    }
    const ret = await request({
      url: '/user',
      method: 'post',
      data: {
        username,
        password,
        age,
        sex,
        email,
        phone,
        avatar: this.nameToImage(username),
      },
    });
    if (ret.code == 1) {
      toast.success('注册成功, 请登录！', toastOption);
    }
  }

  handleChange = (name, value) => {
    this.setState({
      [name]: value,
    })
  }

  nameToImage = (name) => {
    const Initials = name.charAt(0);
    const fontSize = 60;
    const fontWeight = 'bold';

    const canvas = this.canvas;
    canvas.width = 120;
    canvas.height = 120;
    const context = canvas.getContext('2d');
    context.fillStyle = '#F7F7F9';
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = '#605CA8';
    context.font = fontWeight + ' ' + fontSize + 'px sans-serif';
    context.textAlign = 'center';
    context.textBaseline="middle";
    context.fillText(Initials, fontSize, fontSize);
    return canvas.toDataURL("image/png");
  }

  handleToggle = () => {
    this.setState({
      name: '',
      passwd: '',
      username: '',
      password: '',
      repassword: '',
      age: 0,
      sex: null,
      email: null,
      phone: null,
    })
  }

  render() {
    return (
      <div className="login-container">
        <ToastContainer/>
        <canvas ref={(ref) => {this.canvas=ref}} style={{display: 'none'}}></canvas>
        <div className="card login">
          <Tab
            isCenter={true}
            handleClick={this.handleToggle}
          >
            <TabItem icon='sign-in' content={t('Sign In')}>
              <div className="content">
                <Input
                  placeholder="username"
                  label="Username"
                  name="name"
                  key="name"
                  required={true}
                  handleChange={this.handleChange}
                />
                <Input
                  placeholder="password"
                  key="passwd"
                  label="Password"
                  type="password"
                  name="passwd"
                  required={true}
                  handleChange={this.handleChange}
                />
                <a className="button is-primary is-small pull-right" onClick={this.handleLogin}>登录</a>
              </div>
            </TabItem>
            <TabItem icon='registered' content={t('Register')}>
              <div className="content">
                <Input
                  placeholder="username"
                  label="Username"
                  name="username"
                  key="username"
                  required={true}
                  handleChange={this.handleChange}
                />
                <Input
                  placeholder="password"
                  label="Password"
                  type="password"
                  name="password"
                  key="password"
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
                    value: t('Male')
                  }, {
                    label: 'female',
                    value: t('Female')
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
                <a className="button is-primary is-small pull-right" onClick={this.handleReg}>注册</a>
              </div>
            </TabItem>
          </Tab>
        </div>
        <div className="footer">
          © Copyright 2017. jerry chatRoom, All rights reserved.
        </div>
      </div>
    );
  }
};
