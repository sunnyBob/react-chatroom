const dao = require('../dao');
const userService = require('./index');

exports.getGroup = async (id, userId, groupId, type) => {
  if (id || type === '1') {
    const ret = await dao.query('groups.findGroup', { id, userId });
    return ret;
  } else if (type === '2') {
    const ret = dao.query('groups.findManageGroup', { userId });
    return ret;
  } else if (type === '3') {
    const ret = dao.query('groups.findJoinedGroup', { userId });
    return ret;
  } else if (type === '4') {
    const ret = dao.query('groups.findUserById', { userId, groupId });
    return ret;
  }
}

exports.createGroup = async (selectedFriends, create_user_id, group_name, group_avatar) => {
  const ids = selectedFriends.map(fri => fri.id);
  const names = selectedFriends.slice(0, 2).map(fri => fri.name);
  names.forEach(name => {
    group_name += `、${name}`;
  });
  group_name += `...(${selectedFriends.length + 1})`;

  const createRet = await dao.insert('groups', {create_user_id, group_name, group_avatar });
  const reqs = [dao.insert('user_group', { user_id: create_user_id, group_id: createRet.insertId })];
  if (createRet.affectedRows) {
    ids.forEach(id => {
      reqs.push(dao.insert('user_group', { user_id: id, group_id: createRet.insertId }));
    });
  }
  await Promise.all(reqs);
  return createRet;
}
