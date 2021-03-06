const dao = require('../dao');

exports.findUser = async (user) => {
  const ret = await dao.query('user.findUser', user);
  return ret;
}

exports.findUserById = async (id) => {
  const ret = await dao.query('user.findUserById', { id });
  return ret;
}

exports.addUser = async (user) => {
  const ret = await dao.insert('user', user);
  return ret;
}

exports.findFriend = async (userId, groupId) => {
  console.log(groupId);
  const ret = groupId ? await dao.query('user.showFriendNotInGroup', { userId, groupId }) : await dao.query('user.showFriend', { userId });
  return ret;
}

exports.addFriend = async (user_id, friend_id) => {
  const ret = await dao.insert('friend', { user_id, friend_id });
  return ret;
}

exports.deleteFriend = async (userId, friendId) => {
  const ret = await dao.execute('user.delFriend', { userId, friendId });
  return ret;
}

exports.updateUserInfo = async (user) => {
  const ret = await dao.update('user', user,  idKey = "id");
  return ret;
}
