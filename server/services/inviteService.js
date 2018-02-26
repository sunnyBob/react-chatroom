const dao = require('../dao');

exports.getInvitation = async (friendId, userId, inviteType) => {
  console.log(friendId);
  const ret = await dao.query('invitation.findInvitation', { friendId, userId, inviteType });
  return ret;
}

exports.sendInvitation = async (invitation) => {
  const ret = await dao.insert('invite', invitation);
  return ret;
}

exports.deleteInvitation = async (id) => {
  const ret = await dao.del('invite', id, idKey = "id");
  return ret;
}
