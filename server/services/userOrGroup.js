const dao = require('../dao');

exports.getUserOrGroup = async (userId, name) => {
  const userRet = await dao.query('user_group.findUser', { userId, name: `%${name}%` });
  const groupRet = await dao.query('user_group.findGroup', { userId, name: `%${name}%` });
  return userRet.concat(groupRet);
};
