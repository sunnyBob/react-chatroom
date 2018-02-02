import React from 'react';
import { Icon, PopoverManager, Tab, TabItem, MyEditor } from '../common';
import './chatRoom.less';

class ChatRoom extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      msg: '',
    };
  }

  changeMsg = (e) => {
    this.setState({
      msg: e.target.value,
    });
  }

  sendMsg = () => {
    const msg = this.state.msg;
    socket.emit('msg', msg);
  }

  render() {
    const socket = io("http://127.0.0.1:3000");
    return (
      <div className="room">
        <div className="chatInfo"></div>
        <div className="message">
          xxx
        </div>
        <div className="wordarea">
          <MyEditor/>
          <button className="pull-right" onClick={this.sendMsg}>{t('Send')}</button>
        </div>
      </div>
    )
  }
}

export {
  ChatRoom
}
