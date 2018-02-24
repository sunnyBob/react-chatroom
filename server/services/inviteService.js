const dao = require('../dao');

exports.getInvitation = async (friendId, userId) => {
  const ret = await dao.query('invitation.findInvitation', { friendId, userId });
  return ret;
}

exports.sendInvitation = async (invitation) => {
  const ret = await dao.insert('invite', invitation);
  return ret;
}
