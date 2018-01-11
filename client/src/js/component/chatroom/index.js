import React from 'react';
import { Icon, PopoverManager, Tab, TabItem } from '../common';
import './chatRoom.less';

class ChatRoom extends React.Component {
  genEmoji = (count, type = 'QQ') => {
    const arr = [];
    const class_name = type === 'QQ' ? 'qemoji' : 'symemoji';
    for (let i = 0; i <= count; i++) {
      arr.push(<a className={`${class_name}-${i}`} key={`${type}-${i}`}></a>);
      if ((i+1) % 15 === 0) {
        arr.push(<br key={`${type}_${i}`}/>);
      }
    }
    return arr;
  }

  showEmoji = (e) => {
    const { pageX, pageY } = e;
    const emojiArr = [];
    
    const content = (
      <Tab
        isBoxed={false}
        handleClick={this.handleToggle}
        size='small'
      >
        <TabItem content={t('QQ Emoji')}>
          <div className="emojibox">
            <div className="qq_emoji">
              {this.genEmoji(104)}
            </div>
          </div>
        </TabItem>
      </Tab>
    )
    PopoverManager.open({
      x: pageX,
      y: pageY,
      reverse: true,
      content,
    })
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
          <div className="toolbar is-clearfix">
            <Icon name="smile-o" size="medium" onClick={this.showEmoji}/>
            <Icon name="folder-o" size="medium"/>
          </div>
          <textarea className="textarea is-primary"></textarea>
          <button className="pull-right">{t('Send')}</button>
        </div>
      </div>
    )
  }
}

export {
  ChatRoom
}
