import React from 'react';
import { Icon } from '../common';
import './chatRoom.less';

class ChatRoom extends React.Component {
  render() {
    return (
      <div className="room">
        <div className="chatInfo"></div>
        <div className="message">
          xxx
        </div>
        <div className="wordarea">
          <div className="toolbar is-clearfix">
            <Icon name="smile-o" size="medium"/>
            <Icon name="folder-o" size="medium"/>
          </div>
          <textarea className="textarea is-primary"></textarea>
          <button className="pull-right">发送</button>
        </div>
      </div>
    )
  }
}

export {
  ChatRoom
}
