import React from 'react';
import ReactDOM from 'react-dom';
import { browserHistory } from 'react-router';
import { Tab, TabItem, ModalManager, UploadAvatar } from '../common';
import request from '../../utils/request';
import GroupMember from './member';
import GroupManager from './manager';
import MainPage from './mainPage';
import commonUtils from '../../utils/commonUtils';
import './group.less';

class GroupDetail extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      countInfo: {
        count: 0,
        maleCount: 0,
        after90Count: 0,
      },
      group: {},
    };
    const userId = JSON.parse(localStorage.getItem('user'))['user_id'];
    this.creater = {}
    commonUtils.findCreaterOrManager(props.groupId, {
      success: (resp) => {
        if (Array.isArray(resp)) {
          if (resp[0].creater[0].id == userId) {
            this.isCreater = true;
          }
          const managerIds = resp[0].manager.map(manager => manager.id);
          this.creater = resp[0].creater[0];
          this.isManager = managerIds.includes(parseInt(userId));
        }
      }
    });
  }

  handleRedirect = () => {
    const modalContainer = document.getElementsByClassName('modal-container')[0];
    const unmountResult = ReactDOM.unmountComponentAtNode(modalContainer);
    if (unmountResult && modalContainer.parentNode) {
      modalContainer.parentNode.removeChild(modalContainer);
    }
    browserHistory.push(`/group-chat/${this.props.groupId}`);
  }

  componentDidMount() {
    this.fetchData();
  }

  fetchData = () => {
    request({
      url: '/group',
      data: {
        groupId: this.props.groupId,
        type: '6',
      }
    }).then(resp => {
      if (resp.code === '1') {
        this.setState({
          countInfo: resp.retList[0],
        });
      }
    });
    request({
      url: '/group',
      data: {
        id: this.props.groupId,
        type: '1',
      }
    }).then(resp => {
      if (resp.code === '1') {
        this.setState({
          group: resp.retList[0],
        });
      }
    });
  }

  handleUpload = () => {
    const modal = ModalManager.open({
      content: <UploadAvatar ref={ref => { this.imagePicker = ref; }}/>,
      showHeader: false,
      onOk: () => handleOk.call(this),
    });
    function handleOk() {
      const group_avatar = this.imagePicker.state.previewUrl || this.imagePicker.img.src;
      if (group_avatar) {
        request({
          url: '/group',
          method: 'PUT',
          data: {
            groupId: this.props.groupId,
            group_avatar,
          },
        }).then(resp => {
          if (resp.code === '1') {
            socket.emit('updateGroupList', this.props.groupId);
            this.fetchData();
            ModalManager.close(modal);
          } else {
            toast.error('头像上传失败', toastOption);
          }
        });
      } else {
        ModalManager.close(modal);
      }
    }
  }

  handleRemoveGroup = () => {
    this.props.handleRemoveGroup(this.props.groupId);
  }

  render() {
    const { countInfo, group={} } = this.state;
    return (
      <div className="group-detail">
        <div className="group-lt">
          <div id="group-lt-top">
            <img src={group.group_avatar}/>
            <p>{group.group_name}</p>
          </div>
          <div id="group-lt-bottom">
            {this.isCreater && <button className="button is-small is-danger" onClick={this.handleRemoveGroup}>解散群</button>}
            {(this.isCreater || this.isManager) && <button className="button is-small is-primary" onClick={this.handleUpload}>修改头像</button>}
            <button className="button is-small is-success" onClick={this.handleRedirect}>发消息</button>
          </div>
        </div>
        <div className="group-rt">
          <Tab>
            <TabItem content="首页">
              <MainPage group={group} countInfo={countInfo} isCreater={this.isCreater} creater={this.creater} isManager={this.isManager} fetchData={this.fetchData}/>
            </TabItem>
            <TabItem content="普通成员">
              <GroupMember group={group} countInfo={countInfo} createrId={this.creater.id} isCreater={this.isCreater} isManager={this.isManager}  fetchData={this.fetchData}/>
            </TabItem>
            <TabItem content="管理员">
              <GroupManager group={group} countInfo={countInfo} createrId={this.creater.id} isCreater={this.isCreater} isManager={this.isManager}  fetchData={this.fetchData}/>
            </TabItem>
          </Tab>
        </div>
      </div>
    );
  }
}

export default GroupDetail;
