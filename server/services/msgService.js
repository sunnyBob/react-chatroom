const dao = require('../dao');

exports.getMsg = async (fromUser, toUser, groupId) => {
  const ret = groupId ? await dao.query('msg.findGroupMsg', { groupId }) : await dao.query('msg.findMsg', { fromUser, toUser });
  return ret;
}

exports.addMsg = async (msgInfo) => {
  const ret = await dao.insert('message', msgInfo);
  return ret;
}
