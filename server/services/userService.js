const dao = require('../dao');
exports.findUser = async (user) => {
  const ret = await dao.query('user.findUser', user);
  return ret;
}

exports.addUser = async (user) => {
  const ret = await dao.insert('user', user);
  return ret;
}

exports.findFriend = async (userId) => {
  const ret = await dao.query('user.showFriend', { userId });
  return ret;
}
