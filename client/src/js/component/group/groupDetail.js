import React from 'react';
import ReactDOM from 'react-dom';
import { browserHistory } from 'react-router';
import { Tab, TabItem } from '../common';
import request from '../../utils/request';
import GroupMember from './member';
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
    };
    this.userId = JSON.parse(localStorage.getItem('user'))['user_id'];
    commonUtils.isCreaterOrManager(this.userId, props.group.id, {
      success: (resp) => {
        if (Array.isArray(resp)) {
          this.isCreater = !!resp[0].create_user_id;
          this.isManager = !!resp[0].manager_id;
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
    browserHistory.push(`/group-chat/${this.props.group.id}`);
  }

  componentDidMount() {
    this.fetchData();
  }

  fetchData = () => {
    request({
      url: '/group',
      data: {
        groupId: this.props.group.id,
        type: '6',
      }
    }).then(resp => {
      if (resp.code === '1') {
        this.setState({
          countInfo: resp.retList[0],
        });
      }
    });
  }

  render() {
    const { group, modal } = this.props;
    const countInfo = this.state.countInfo;
    return (
      <div className="group-detail">
        <div className="group-lt">
          <div id="group-lt-top">
            <img src={group.group_avatar}/>
            <p>{group.group_name}</p>
          </div>
          <div id="group-lt-bottom">
            <button className="button" onClick={this.handleRedirect}>发消息</button>
          </div>
        </div>
        <div className="group-rt">
          <Tab>
            <TabItem content="首页">
              <MainPage group={group} countInfo={countInfo} isCreater={this.isCreater} isManager={this.isManager}/>
            </TabItem>
            <TabItem content="成员">
              <GroupMember group={group} countInfo={countInfo} isCreater={this.isCreater} isManager={this.isManager}/>
            </TabItem>
          </Tab>
        </div>
      </div>
    );
  }
}

export default GroupDetail;
