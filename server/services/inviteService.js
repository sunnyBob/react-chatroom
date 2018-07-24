const dao = require('../dao');

exports.getInvitation = async (friendId, userId, inviteType, groupIds = []) => {
  const promises = [];
  const friendRet = inviteType !== '入群申请' ? await dao.query('invitation.findInvitation', { friendId, userId, inviteType }) : [];
  groupIds.forEach(groupId => {
    promises.push(dao.query('invitation.findGroupInvitation', { groupId, inviteType }));
  });
  const groupRet = [].concat(...(await Promise.all(promises)));
  const ret = [].concat(...friendRet, ...groupRet);
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
