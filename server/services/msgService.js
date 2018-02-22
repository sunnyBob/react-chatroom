const dao = require('../dao');

exports.addMsg = async (msgInfo) => {
  const ret = await dao.insert('message', msgInfo);
  return ret;
}
