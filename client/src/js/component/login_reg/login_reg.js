import React from 'react';
import { Tab, TabItem } from '../common';
import request from '../../utils/request';
export default class LoginReg extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      name: '',
      passwd: '',
    };
  }

  handleLogin = () => {
    const { name, passwd } = this.state;
    const ret = request({
      url: 'login',
      data: {
        name,
        passwd,
      },
    });
    console.log(ret);
  }

  handleChange = (e) => {
    const { name, value } = e.target;
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
                <div className="field is-horizontal">
                  <div className="field-label is-small">
                    <label className="label is-small">用户名</label>
                  </div>
                  <div className="field-body">
                    <div className="field">
                      <div className="control">
                        <input className="input is-small" name="name" type="text" placeholder="username" onChange={this.handleChange}/>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="field is-horizontal">
                  <div className="field-label is-small">
                    <label className="label is-small">密码</label>
                  </div>
                  <div className="field-body">
                    <div className="field">
                      <div className="control">
                        <input className="input is-small" type="password" name="passwd" placeholder="password" onChange={this.handleChange}/>
                      </div>
                    </div>
                  </div>
                </div>
                <a className="button is-primary is-small pull-right" onClick={this.handleLogin}>登录</a>
              </div>
            </TabItem>
            <TabItem icon='registered' content="注册">
              <div className="content">
                <div className="field is-horizontal">
                  <div className="field-label is-small">
                    <label className="label is-small">用户名</label>
                  </div>
                  <div className="field-body">
                    <div className="field">
                      <div className="control">
                        <input className="input is-small" type="text" placeholder="Normal sized input"/>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="field is-horizontal">
                  <div className="field-label is-small">
                    <label className="label is-small">密码</label>
                  </div>
                  <div className="field-body">
                    <div className="field">
                      <div className="control">
                        <input className="input is-small" type="password" placeholder="Normal sized input"/>
                      </div>
                    </div>
                  </div>
                </div>
                <a className="button is-primary is-small pull-right">注册</a>
              </div>
            </TabItem>
          </Tab>
        </div>
      </div>
    );
  }
};
