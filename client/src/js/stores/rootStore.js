import { observable, action, computed } from 'mobx';
import request from '../utils/request';

export default class RootStore {
  @observable userInfo = {};
  @observable friendsInfo = [];
  @observable invitation = [];
  @observable group = {};
  @observable createGroup = [];
  @observable manageGroup = [];
  @observable joinedGroup = [];

  @action
  getUser(id) {
    request({
      url: '/user',
      data: { id },
    }).then((resp) => {
      if (Array.isArray(resp.retList)) {
        this.userInfo = resp.retList[0];
      }
    });
  }

  @action
  getFriends(userId) {
    request({
      url: '/friends',
      data: { userId },
    }).then((resp) => {
      if (Array.isArray(resp.retList)) {
        this.friendsInfo = resp.retList;
      }
    });
  }

  @action
  getInvitation(friend_id) {
    request({
      url: '/invitation',
      data: { friend_id },
    }).then((resp) => {
      if (Array.isArray(resp.retList)) {
        this.invitation = resp.retList;
      }
    });
  }

  @computed
  get inviteCount() {
    return this.invitation.length;
  }

  @action
  getGroup(id) {
    request({
      url: '/group',
      data: { id },
    }).then((resp) => {
      if (Array.isArray(resp.retList)) {
        this.group = resp.retList;
      }
    });
  }

  @action
  getCreateGroup(userId) {
    request({
      url: '/group',
      data: { userId, type: '1' },
    }).then((resp) => {
      if (Array.isArray(resp.retList)) {
        this.createGroup = resp.retList;
      }
    });
  }

  @action
  getManageGroup(userId) {
    request({
      url: '/group',
      data: { userId, type: '2' },
    }).then((resp) => {
      if (Array.isArray(resp.retList)) {
        this.manageGroup = resp.retList;
      }
    });
  }

  @action
  getJoinedGroup(userId) {
    request({
      url: '/group',
      data: { userId, type: '3' },
    }).then((resp) => {
      if (Array.isArray(resp.retList)) {
        this.joinedGroup = resp.retList;
      }
    });
  }
}
