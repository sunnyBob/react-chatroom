const dao = require('../dao');
exports.findUser = async (user) => {
  const ret = await dao.execute('user.findUser', user);
  console.log(ret);
  return ret;
}
