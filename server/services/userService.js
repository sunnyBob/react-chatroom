const dao = require('../dao');
exports.findUser = async (user) => {
  const ret = await dao.execute('user.findUser', user);
  return ret;
}

exports.addUser = async (user) => {
  const ret = await dao.insert('user', user);
  return ret;
}
