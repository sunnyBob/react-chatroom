const dao = require('../dao');
const userService = require('./index');

exports.getGroupInfo = async (id, userId, groupId, type) => {
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
    const ret = dao.query('groups.findGroupUser', { userId, groupId });
    return ret;
  } else if (type === '5') {
    const ret = dao.query('groups.findManageGroups', { userId, groupId });
    return ret;
  }
}

exports.createGroup = async (selectedFriends, create_user_id, group_name, group_avatar) => {
  const ids = selectedFriends.map(fri => fri.id);
  const names = selectedFriends.slice(0, 2).map(fri => fri.name);
  names.forEach(name => {
    group_name += `、${name}`;
  });
  group_name += selectedFriends.length > 2 ? `...(${selectedFriends.length + 1})` : `(${selectedFriends.length + 1})`;

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

exports.joinGroup = async (user_id, group_id) => {
  const ret = await dao.insert('user_group', {user_id, group_id});
  const group = (await dao.query('groups.findGroup', { id: group_id }))[0] || {};
  const groupName = group.group_name || '';
  const count = parseInt(groupName.match(/\d+/g)) + 1;
  let newGroupName = groupName;
  if (count === '3') {
    newGroupName = `${groupName.split('(')[0]}...(${count})`;
  } else {
    newGroupName = `${groupName.split('(')[0]}(${count})`;
  }
  console.log(newGroupName);
  await dao.update('groups', { group_name: newGroupName, id: group_id },  idKey = "id");
  console.log('3333333333333333-----------------------------------------------33333333');
  return ret;
}
