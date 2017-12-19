import React from 'react';
import { inject, observer } from 'mobx-react';
import { Menu, Menus } from '../component/common';

@inject('rootStore')
@observer
class Root extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="container is-fullhd layout">
        <div className="container is-fluid mainpage">
          <div className="columns" style={{height: '100%'}}>
            <div className="column is-2 menubox">
              <Menus>
                <Menu>1</Menu>
                <Menu>2</Menu>
                <Menu>3</Menu>
              </Menus>
            </div>
            <div className="column is-10 room">
              {this.props.children}
            </div>
          </div>
          <div className="footer">
            © Copyright 2017. jerry chatRoom, All rights reserved.
          </div>
        </div>
      </div>
    )
  }
}

export default Root;
