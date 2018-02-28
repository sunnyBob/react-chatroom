const dao = require('../dao');

exports.getInvitation = async (friendId, userId, inviteType) => {
  const ret = await dao.query('invitation.findInvitation', { friendId, userId, inviteType });
  return ret;
}

exports.sendInvitation = async (invitation) => {
  const ret = await dao.insert('invite', invitation);
  return ret;
}

exports.deleteInvitation = async (friendId, userId, groupId) => {
  const ret = await dao.execute('invitation.deleteInvitation', { friendId, userId, groupId });
  return ret;
}
