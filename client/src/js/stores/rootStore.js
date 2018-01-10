import { observable, action } from 'mobx';
import request from '../utils/request';

export default class RootStore {
  @observable userInfo = {};
  @observable friendsInfo = [];

  @action
  getUser(id) {
    request({
      url: '/user',
      data: { id },
    }).then((resp) => {
      if (Array.isArray(resp.retList) && resp.retList.length) {
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
      if (Array.isArray(resp.retList) && resp.retList.length) {
        this.friendsInfo = resp.retList;
      }
    });
  }
}
