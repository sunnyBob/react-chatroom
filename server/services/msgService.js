const dao = require('../dao');

exports.getMsg = async (userId) => {
  const ret = await dao.query('msg.findMsg', { userId });
  return ret;
}

exports.addMsg = async (msgInfo) => {
  const ret = await dao.insert('message', msgInfo);
  return ret;
}
