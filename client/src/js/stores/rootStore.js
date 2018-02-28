import { observable, action, computed } from 'mobx';
import request from '../utils/request';

export default class RootStore {
  @observable userInfo = {};
  @observable friendsInfo = [];
  @observable invitation = [];

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
}
