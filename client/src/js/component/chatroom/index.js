import React from 'react';
import { Icon, PopoverManager, Tab, TabItem } from '../common';
import Textarea from 'react-contenteditable';
import request from '../../utils/request';
import './chatRoom.less';

class ChatRoom extends React.Component {
  constructor(props) {
    super(props);

    this.state = { 
      html: '',
    };

    const user = localStorage.getItem('user');
    this.user = JSON.parse(user);

    this.msgEl = [];
  }

  handleChange = evt => {
    this.setState({html: evt.target.value});
  };

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

  addEmoji = (e) => {
    if (e.target.tagName === 'A') {
      this.setState({ html: this.state.html + ':' + e.target.className + ':'});
    }
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
            <div className="qq_emoji" onClick={this.addEmoji}>
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

  sendMsg = async () => {
    const html = this.state.html;
    const ret = await request({
      url: '/message',
      method: 'post',
      data: {
        from_user: this.user.user_id,
        to_user: parseInt(this.props.params.id),
        content: html,
      },
    });
    console.log(ret);
    this.msgEl.push(<div className="msginfo-right"  key={Math.random()} ><div dangerouslySetInnerHTML={{ __html: html.replace(/:qemoji-([0-9]+):/g, (match) => `<a class=${match.split(':')[1]}></a>`)}}/></div>);
    this.setState({
      html: '',
      msgEl: this.msgEl,
    }, () => {
      this.msgBox.scrollTop = this.msgBox.scrollHeight;
    });
  }

  render() {
    const socket = io("http://127.0.0.1:3000");
    return (
      <div className="room">
        <div className="chatInfo"></div>
        <div className="message" ref={ref => { this.msgBox = ref; }}>
          {this.state.msgEl}
        </div>
        <div className="wordarea">
          <div className="toolbar is-clearfix">
            <Icon name="smile-o" size="medium" onClick={this.showEmoji}/>
            <Icon name="folder-o" size="medium"/>
          </div>
          <Textarea className="textarea is-primary" html={this.state.html} onChange={this.handleChange}/>
          <button className="pull-right" onClick={this.sendMsg}>{t('Send')}</button>
        </div>
      </div>
    )
  }
}

export {
  ChatRoom
}
