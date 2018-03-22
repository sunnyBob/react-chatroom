import React from 'react';
import { Link, browserHistory } from 'react-router';
import { inject, observer } from 'mobx-react';
import { Icon, PopoverManager, Tab, TabItem } from '../common';
import request from '../../utils/request';
import commonUtils from '../../utils/commonUtils';
import Textarea from 'react-contenteditable';
import { toast } from 'react-toastify';

import './chatRoom.less';

@inject('RootStore')
@observer
class ChatRoom extends React.Component {
  constructor(props) {
    super(props);

    this.state = { 
      html: '',
      currentChatUser: {},
      currentGroup: {},
      msgEl: [],
    };

    const user = localStorage.getItem('user');
    this.user = JSON.parse(user);
    const pathName = location.pathname.split('/')[1];
    console.log(pathName);
    this.isGroup = pathName !== 'chat';
    this.store = new props.RootStore();

    socket.on('chatToOne', (msg, userId) => {
      if (userId == this.props.params.id) {
        this.handleRecvMsg(msg);
      }
    });
    socket.on('chatToMore', (msg, userId, groupId, avatar) => {
      if (groupId == this.props.params.id && this.user.user_id != userId) {
        this.handleRecvMsg(msg, userId, avatar);
      }
    });
  }

  componentDidMount() {
    const id = this.props.params.id;
    const userId = this.user.user_id
    if (!this.isGroup) {
      id && commonUtils.isFriend(userId, id, {
        success: () => {
          this.getCurrentUser(id);
        },
        fail: () => {
          browserHistory.push('/');
        },
      });
    } else {
      id && commonUtils.isGroupMember(userId, id, {
        success: () => {
          socket.emit('joinRoom', userId, `room-${id}`);
          this.getCurrentGroup(id);
        },
        fail: () => {
          browserHistory.push('/');
        },
      });
    }
  }

  componentWillReceiveProps(nextProps) {
    const id = this.props.params.id;
    const nextId = nextProps.params.id;
    const userId = this.user.user_id;
    const pathName = location.pathname.split('/')[1];
    console.log(pathName);
    if (id !== nextId) {
      this.isGroup = pathName !== 'chat';
      if (!this.isGroup) {
        nextId && commonUtils.isFriend(userId, nextId, {
          success: () => {
            this.getCurrentUser(nextId);
            this.setState({
              html: '',
            });
          },
          fail: () => {
            browserHistory.push('/');
          },
        });
      } else {
        nextId && commonUtils.isGroupMember(userId, nextId, {
          success: () => {
            socket.emit('joinRoom', userId, `room-${nextId}`);
            this.getCurrentGroup(nextId);
          },
          fail: () => {
            browserHistory.push('/');
          },
        });
      }
    }
  }

  handleChange = evt => {
    this.setState({html: evt.target.value});
  };

  getCurrentUser = async (id) => {
    const resp =  await request({
      url: '/user',
      data: {
        id,
      }
    });
    if (Array.isArray(resp.retList) && resp.retList.length) {
      this.setState({
        currentChatUser: resp.retList[0],
      }, () => {
        this.getCurrentUserMsg(id);
      });
    }
  }

  getCurrentUserMsg = async (userId) => {
    const { user_id, avatar } = this.user;
    const resp =  await request({
      url: '/message',
      data: {
        fromUser: user_id,
        toUser: userId,
      },
    });
    if (Array.isArray(resp.retList)) {
      const messages = resp.retList;
      const msgEl = [];
      messages.forEach(msg => {
        const { from_user, to_user, content } = msg;
        if (from_user == userId) {
          msgEl.push(<div className="msginfo-left"  key={Math.random()} >
            <Link to={`/user-info/${userId}`}><img src={this.state.currentChatUser.avatar} className="avatar"/></Link>
            <div dangerouslySetInnerHTML={{ __html: content.replace(/:qemoji-([0-9]+):/g, (match) => `<a class=${match.split(':')[1]}></a>`)}}/>
          </div>);
        }
        if (to_user == userId) {
          
          msgEl.push(<div className="msginfo-right"  key={Math.random()} >
            <div dangerouslySetInnerHTML={{ __html: content.replace(/:qemoji-([0-9]+):/g, (match) => `<a class=${match.split(':')[1]}></a>`)}}/>
            <Link to={`/user-info/${user_id}`}><img src={avatar} className="avatar"/></Link>
          </div>);
        }
      });
      this.setState({ msgEl }, () => {
        this.msgBox.scrollTop = this.msgBox.scrollHeight;
      });
    }
  }

  getCurrentGroup = async (id) => {
    const resp =  await request({
      url: '/group',
      data: {
        id,
        type: '1',
      }
    });
    if (Array.isArray(resp.retList) && resp.retList.length) {
      this.setState({
        currentGroup: resp.retList[0],
      }, () => {
        this.getCurrentGroupMsg(id);
      });
    }
  }

  getCurrentGroupMsg = async (groupId) => {
    const { user_id, avatar } = this.user;
    const resp = await request({
      url: '/message',
      data: {
        fromUser: user_id,
        groupId,
      },
    });
    if (Array.isArray(resp.retList)) {
      const messages = resp.retList;
      const msgEl = [];
      messages.forEach(msg => {
        const { from_user, content, avatar } = msg;
        if (from_user != user_id) {
          msgEl.push(<div className="msginfo-left"  key={Math.random()} >
            <Link to={`/user-info/${from_user}`}><img src={avatar} className="avatar"/></Link>
            <div dangerouslySetInnerHTML={{ __html: content.replace(/:qemoji-([0-9]+):/g, (match) => `<a class=${match.split(':')[1]}></a>`)}}/>
          </div>);
        } else {
          msgEl.push(<div className="msginfo-right"  key={Math.random()} >
            <div dangerouslySetInnerHTML={{ __html: content.replace(/:qemoji-([0-9]+):/g, (match) => `<a class=${match.split(':')[1]}></a>`)}}/>
            <Link to={`/user-info/${user_id}`}><img src={avatar} className="avatar"/></Link>
          </div>);
        }
      });
      this.setState({ msgEl }, () => {
        this.msgBox.scrollTop = this.msgBox.scrollHeight;
      });
    }
  }

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

  sendMsg = async (e) => {
    const keyCode = e.keyCode || e.which || e.charCode;
    const ctrlKey = e.ctrlKey || e.metaKey;
    const { html } = this.state;
    const id = this.props.params.id;

    if (keyCode && (!ctrlKey || keyCode !== 13)) {
      return;
    }

    this.setState({
      html: '',
    });
    if (!id) {
      toast.error('No chats selected!', toastOption);
      return;
    }
    
    if (!html.trim()) {
      toast.error('消息内容不能为空!', toastOption);
      return;
    }

    const data = this.isGroup ? {
      from_user: this.user.user_id,
      content: html,
      groupId: id,
    } : {
      from_user: this.user.user_id,
      to_user: parseInt(id),
      content: html,
    };
    const ret = await request({
      url: '/message',
      method: 'post',
      data,
    });
    if (ret.code) {
      const { avatar, user_id } = this.user;
      const msgEl = [...this.state.msgEl];
      if (this.isGroup) {
        socket.emit('chatToMore', html, user_id, id, avatar);
      } else {
        socket.emit('chatToOne', html, user_id, id);
      }
      msgEl.push(<div className="msginfo-right"  key={Math.random()} >
        <div dangerouslySetInnerHTML={{ __html: html.replace(/:qemoji-([0-9]+):/g, (match) => `<a class=${match.split(':')[1]}></a>`)}}/>
        <Link to={`/user-info/${user_id}`}>
          <img src={avatar} className="avatar"/>
        </Link>
      </div>);
      this.setState({
        msgEl: msgEl,
      }, () => {
        this.msgBox.scrollTop = this.msgBox.scrollHeight;
      });
    }
  }

  handleRecvMsg = (msg, id, avatar) => {
    const msgEl = [...this.state.msgEl];
    msgEl.push(<div className="msginfo-left"  key={Math.random()} >
      {
        this.isGroup ? <Link to={`/user-info/${id}`}>
          <img src={avatar} className="avatar"/>
        </Link> : <Link to={`/user-info/${this.state.currentChatUser.id}`}>
          <img src={this.state.currentChatUser.avatar} className="avatar"/>
        </Link>
      }
      <div dangerouslySetInnerHTML={{ __html: msg.replace(/:qemoji-([0-9]+):/g, (match) => `<a class=${match.split(':')[1]}></a>`)}}/>
    </div>);
    this.setState({
      msgEl: msgEl,
    }, () => {
      this.msgBox.scrollTop = this.msgBox.scrollHeight;
    });
  }

  render() {
    const name = this.isGroup ? this.state.currentGroup.group_name : this.state.currentChatUser.username;
    const fontStyle = {fontWeight: '800', color: 'blue', margin: '0 5px', fontSize: '16px'};
    return (
      <div className="room">
        {
          !this.isGroup ? (
            <div className="chatInfo">
              {name && <div>正在与<span style={fontStyle}>{name}</span>聊天...</div>}
            </div>
          ) : (
            <div className="chatInfo">
              {name && <div>
                  <span style={fontStyle}>{name}</span>
                  <Icon name="angle-down"/>
              </div>}
              <div>hello world</div>
            </div>
          )
        }
        <div className="message" ref={ref => { this.msgBox = ref; }}>
          {this.state.msgEl}
        </div>
        <div className="wordarea">
          <div className="toolbar is-clearfix">
            <Icon name="smile-o" size="medium" onClick={this.showEmoji}/>
            <Icon name="folder-o" size="medium"/>
          </div>
          <Textarea ref={ref => { this.textarea = ref; }} className="textarea is-primary" html={this.state.html} onChange={this.handleChange} onKeyDown={this.sendMsg}/>
          <div className="room-bottom">
            <span>『按ctrl/cmd + enter组合键发送』</span>
            <button className="button is-small" onClick={this.sendMsg}>{t('Send')}</button>
          </div>
        </div>
      </div>
    )
  }
}

export {
  ChatRoom
};
