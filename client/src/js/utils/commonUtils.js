import request from './request';

export default class {
  static isFriend(userId, friendId, options = {}) {
    request({
      url: '/friends',
      data: {
        userId,
      },
    }).then(resp => {
      const isFriend = resp.code == 1 && resp.retList.some(friend => friend.friend_id == friendId || friend.user_id == friendId);
      if (isFriend) {
        options.success && options.success();
      } else {
        options.fail && options.fail();
      }
    });
  }

  static isGroupMember(userId, groupId, options = {}) {
    request({
      url: '/group',
      data: {
        userId,
        groupId,
        type: '4',
      },
    }).then(resp => {
      const isGroupMember = resp.code == 1 && resp.retList.length;
      if (isGroupMember) {
        options.success && options.success();
      } else {
        options.fail && options.fail();
      }
    });
  }
}
