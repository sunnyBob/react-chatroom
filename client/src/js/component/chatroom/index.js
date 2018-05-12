import React from 'react';
import { Link, browserHistory } from 'react-router';
import { inject, observer } from 'mobx-react';
import axios from 'axios';
import { Icon, PopoverManager, Tab, TabItem } from '../common';
import request from '../../utils/request';
import commonUtils from '../../utils/commonUtils';
import Textarea from 'react-contenteditable';
import { toast } from 'react-toastify';
import GroupUser from './groupUser';

import './chatRoom.less';

const baseUrl = '/video.html';

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
      isShowGroupUser: false,
    };

    const user = localStorage.getItem('user');
    this.user = JSON.parse(user);
    const pathName = location.pathname.split('/')[1];
    this.isGroup = pathName !== 'chat';
    this.store = new props.RootStore();
    this.hash = '';

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
    socket.on('updateGroupUser', (groupId) => {
      this.getCurrentGroup(groupId);
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
    if (ret.code === '1') {
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

  toggleShowGroupUser = () => {
    this.setState({
      isShowGroupUser: !this.state.isShowGroupUser,
    });
  }

  sendVideoUrl = async () => {
    const id = this.props.params.id;
    const { user_id, user_name, avatar } = this.user;
    const html= `<a href='${baseUrl}?hash=${this.hash}' target="_blank">视频邀请，请点击 ${baseUrl}?hash=${this.hash}</a>`;    
    const data = {
      from_user: user_id,
      to_user: parseInt(id),
      content: html,
    };
    const ret = await request({
      url: '/message',
      method: 'post',
      data,
    });
    if (ret.code) {
      const msgEl = [...this.state.msgEl];
      socket.emit('chatToOne', html, user_id, id);
      msgEl.push(<div className="msginfo-right"  key={Math.random()} >
      <div dangerouslySetInnerHTML={{ __html: html }}/>
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

  handleVideo = () => {
    this.hash = Math.random();
    this.sendVideoUrl();
    window.open(`${baseUrl}?hash=${this.hash}`);
  }

  genIcon = (fileName) => {
    const suffix = fileName.slice(fileName.lastIndexOf('.'));
    const videoReg = /^(.mp4|.3gp|.rmvb|.avi|.wmv)$/;
    const codeReg = /^(.js|.cpp|.c|.py|.java|.cs)$/;
    const audioReg = /^(.mp3)$/;
    const archive = /^(.zip|.rar)$/;
    const officeMapper = {
      '.doc': 'file-word',
      '.docx': 'file-word',
      '.xlsx': 'file-excel',
      '.pptx': 'file-powerpoint',
      '.pdf': 'file-pdf',
    };
    if (videoReg.test(suffix)) {
      return 'file-video';
    }
    if (codeReg.test(suffix)) {
      return 'file-code';
    }
    if (audioReg.test(suffix)) {
      return 'file-audio';
    }
    if (archive.test(suffix)) {
      return 'file-archive';
    }
    if (videoReg.test(suffix)) {
      return 'file-film';
    }
    return officeMapper[suffix] || 'file';
  }

  handleFileChange = (e) => {
    const file = e.target.files[0];
    const formData = new FormData(this.form);
    const id = this.props.params.id;
    const { user_id, user_name, avatar } = this.user;
    let size = file.size;
    const fileName = file.name;
    const progressId = Date.now();
    const msgEl = [...this.state.msgEl];
    if (size < 1024) {
      size = `${Number(size).toFixed(2)}B`;
    } else if (size / 1024 < 1024) {
      size = `${Number(size / 1024).toFixed(2)}KB`;
    } else if (size / 1024 / 1024 < 1024) {
      size = `${Number(size / 1024 / 1024).toFixed(2)}MB`;
    } else if (size / 1024 / 1024 /1024 < 1024) {
      size = `${Number(size / 1024 / 1024 / 1024).toFixed(2)}GB`;
    }
    let html = `<div class="columns file-desc">
      <div class="column is-2">
        <i class="far fa-${this.genIcon(fileName)} fa-3x"></i>
      </div>
      <div class="column">
        <div>${fileName}</div>
        <div id="con_${progressId}">
          <progress id="${progressId}" max="100"></progress> 
        </div>
      </div>
    </div>`;
    msgEl.push(<div className="msginfo-right"  key={Math.random()}>
      <div dangerouslySetInnerHTML={{ __html: html }}/>
        <Link to={`/user-info/${user_id}`}>
          <img src={avatar} className="avatar"/>
        </Link>
      </div>
    );
    this.setState({
      msgEl: msgEl,
    }, () => {
      axios({
        url: '/upload',
        method: 'post',
        data: formData,
        onUploadProgress: (evt) => {
          if(evt.lengthComputable){
            document.getElementById(progressId).value = evt.loaded / evt.total * 100;
            if (evt.loaded === evt.total) {
              document.getElementById(`con_${progressId}`).innerHTML = `
                <div>
                  <span class="file-size">${size}</span>
                  <span> | </span>
                  <a href="/download/?name=${fileName}" download={fileName}>Download</a>
                </div>
              `;
            }
          }
        },
      })
      .then(async (resp) => {
        html = `<div class="columns file-desc">
          <div class="column is-2">
            <i class="far fa-${this.genIcon(fileName)} fa-3x"></i>
          </div>
          <div class="column">
            <div>${fileName}</div>
            <div id="div-${progressId}">
              <div>
                <span class="file-size">${size}</span>
                <span> | </span>
                <a href="/download/?name=${fileName}" download=${fileName}>Download</a>
              </div> 
            </div>
          </div>
        </div>`;
        const data = {
          from_user: user_id,
          to_user: parseInt(id),
          content: html,
        };
        const ret = await request({
          url: '/message',
          method: 'post',
          data,
        });
        if (ret.code === '1') {
          if (this.isGroup) {
            socket.emit('chatToMore', html, user_id, id, avatar);
          } else {
            socket.emit('chatToOne', html, user_id, id);
          }
        }
      })
      .catch((error) => {
        console.log(error);
      });
      this.msgBox.scrollTop = this.msgBox.scrollHeight;
      document.getElementById('xFile').value = '';
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
              {name && <div className="msg-topbar">
                <span style={fontStyle}>{name}</span>
                <Icon name={this.state.isShowGroupUser ? 'angle-up' : 'angle-down'} onClick={this.toggleShowGroupUser}/>
                { this.state.isShowGroupUser && <GroupUser groupId={this.props.params.id}/>}
              </div>}
            </div>
          )
        }
        <div className="message" ref={ref => { this.msgBox = ref; }}>
          {this.state.msgEl}
        </div>
        <div className="wordarea">
          <div className="toolbar is-clearfix">
            <Icon name="smile" prefix1='far' onClick={this.showEmoji}/>
            {!this.isGroup && <Icon name="camera-retro" prefix1='fal' onClick={this.handleVideo}/>}
            <div className="sendFile">
              <form ref={form => { this.form = form; }}>
                <input type="file" id="xFile" name="file" style={{position:'absolute',clip:'rect(0 0 0 0)'}} onChange={this.handleFileChange}/>
                <label htmlFor="xFile"><Icon name="folder-open" prefix1='far'/></label>
              </form>
            </div>
          </div>
          <Textarea ref={ref => { this.textarea = ref; }} className="textarea is-primary" html={this.state.html} onChange={this.handleChange} onKeyDown={this.sendMsg}/>
          <div className="room-bottom">
            <span>『按Ctrl/Cmd + Enter组合键发送』</span>
            <button className="button is-small" onClick={this.sendMsg}>{t('Send')}</button>
          </div>
        </div>
      </div>
    );
  }
}

export {
  ChatRoom
};
