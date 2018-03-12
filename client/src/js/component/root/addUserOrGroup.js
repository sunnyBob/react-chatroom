import React from 'react';
import ReactDOM from 'react-dom';
import { Icon } from '../common';
import request from '../../utils/request';
import commonUtils from '../../utils/commonUtils';
import { toast } from 'react-toastify';

import './addUserOrGroup.less';

class AddUsrGroup extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      result: {},
      isGroup: false,
    };
    this.user = JSON.parse(localStorage.getItem('user'));
  }

  handleSearch = (e) => {
    const id = ReactDOM.findDOMNode(this.input).value.trim();
    if (!id) {
      toast.error('请输入id后再进行查找', toastOption);
      return;
    }
    const name = e.target.name;
    if (name === 'user') {
      request({
        url: '/user',
        data: {
          id,
        }
      }).then(resp => {
        if (Array.isArray(resp.retList)) {
          this.setState({
            isGroup: false,
            result: resp.retList[0] || [],
          })
        }
      });
    } else if (name === 'group') {
      request({
        url: '/group',
        data: {
          id,
        },
      }).then(resp => {
        if (Array.isArray(resp.retList)) {
          this.setState({
            isGroup: true,
            result: resp.retList[0] || [],
          })
        }
      });
    }
  }

  clear = (e) => {
    this.input.value = '';
    this.setState({ result: {} });
  }

  sendInvitation = (id, groupName) => {
    const { user_id, user_name } = this.user;
    if (this.state.isGroup) {
      commonUtils.isGroupMember(user_id, id, {
        success: () => {
          toast.error('您已在该群聊', toastOption);
        },
        fail: () => {
          request({
            url:'/invitation',
            method: 'post',
            data: {
              group_id: String(id),
              user_id: user_id,
              username: user_name,
              invite_type: '入群申请',
              group_name: groupName,
            },
          }).then(resp => {
            if (resp.code == 1) {
              toast.success('成功发送入群申请', toastOption);
              socket.emit('updateInvitation', id);
              this.props.onClose();
            }
          });
        },
      });
    } else {
      if (user_id == id) {
        toast.error('无法添加自己为好友', toastOption);
      } else {
        commonUtils.isFriend(user_id, id, {
          success: () => {
            toast.error('该用户已经是您的好友', toastOption);
          },
          fail: () => {
            request({
              url:'/invitation',
              method: 'post',
              data: {
                user_id: user_id,
                friend_id: id,
                username: user_name,
                invite_type: '好友申请',
              },
            }).then(resp => {
              if (resp.code == 1) {
                toast.success('成功发送好友申请', toastOption);
                socket.emit('updateInvitation', id);
                this.props.onClose();
              }
            });
          },
        });
      }
    }
  }

  render() {
    const { id, avatar, username, group_name, group_avatar } = this.state.result;
    
    return (
      <div className="adduserorgroup">
        <h5>{t('Add User/Group')}</h5>
        <div className="field">
          <p className="control has-icons-left has-icons-right">
            <input placeholder={t('Enter Id')} className="input is-small is-info search" name="userId" ref={ref =>{ this.input = ref }}/>
            <Icon name="search" className="is-left"/>
            <Icon name="close" className="is-right" onClick={this.clear}/>
          </p>
        </div>
        <div className="search-btn">
          <button onClick={this.handleSearch} name="user" className="button is-small">{t('Find Friends')}</button>
          <button onClick={this.handleSearch} name="group" className="button is-small">{t('Find Groups')}</button>
        </div>
        {
          Object.keys(this.state.result).length ? <div className="result">
            <div className="person">
              <img src={avatar || group_avatar} className="avatar"/>
              <span>{username || group_name}</span>
            </div>
            <button className="button is-info is-small" onClick={this.sendInvitation.bind(null, id, group_name)}>{t('Add')}</button>
          </div> : null
        }
      </div>
    );
  }
}

export default AddUsrGroup;
