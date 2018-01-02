import { observable, action } from 'mobx';
import request from '../utils/request';

export default class RootStore {
  @observable userInfo = {};

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
}
