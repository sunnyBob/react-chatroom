const dao = require('../dao');
const userService = require('./index');

exports.getGroupInfo = async (id, userId, groupId, type, userName, limit = '10', offset = '0') => {
  if (id || type === '1') {
    const ret = await dao.query('groups.findGroup', { id, userId });
    return ret;
  } else if (type === '2') {
    const ret = await dao.query('groups.findManageGroup', { userId });
    return ret;
  } else if (type === '3') {
    const ret = await dao.query('groups.findJoinedGroup', { userId });
    return ret;
  } else if (type === '4') {
    const ret = await dao.query('groups.findGroupUser', { userId, groupId, userName: userName && `%${userName}%`, limit: parseInt(limit), offset: parseInt(offset) });
    const count = await dao.query('groups.findGroupUsersCount', { groupId });
    return [...ret, ...count];
  } else if (type === '5') {
    const ret = await dao.query('groups.findManageGroups', { userId, groupId });
    return ret;
  } else if (type === '6') {
    const count = await dao.query('groups.findGroupUsersCount', { groupId });
    const maleCount = await dao.query('groups.findGroupMaleCount', { groupId });
    const after90Count = await dao.query('groups.findAfter90Count', { groupId });

    return [{
      count: count[0]['count(1)'],
      maleCount: maleCount[0]['count(1)'],
      after90Count: after90Count[0]['count(1)'],
    }];
  } else if (type === '7') {
    const ret = await dao.query('groups.findCreaterOrManager', { userId, groupId });

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

exports.joinGroup = async (user_id, group_id) => {
  const ret = await dao.insert('user_group', {user_id, group_id});
  const group = (await dao.query('groups.findGroup', { id: group_id }))[0] || {};
  const groupName = group.group_name || '';
  const count = parseInt(groupName.match(/\d+/g)) + 1;
  const newGroupName = `${groupName.split('(')[0]}(${count})`;
  await dao.update('groups', { group_name: newGroupName, id: group_id },  idKey = "id");
  return ret;
}

exports.inviteIntoGroup = async (users, group_id) => {
  const group = (await dao.query('groups.findGroup', { id: group_id }))[0] || {};
  const groupName = group.group_name || '';
  const count = parseInt(groupName.match(/\d+/g)) + users.length;
  const newGroupName = `${groupName.split('(')[0]}(${count})`;

  users.forEach(async user_id => {
    await dao.insert('user_group', {user_id, group_id});
  });
  const ret = await dao.update('groups', { group_name: newGroupName, id: group_id },  idKey = "id");

  return ret;
}

exports.deleteFromGroup = async (ids, group_id, groupName) => {
  ids.forEach(async user_id => {
    await dao.execute('groups.delMember', { user_id, group_id });
    await dao.execute('groups.delManager', { user_id, group_id });
  });

  const count = parseInt(groupName.match(/\d+/g)) - ids.length;
  const newGroupName = `${groupName.split('(')[0]}(${count})`;
  const ret = await dao.update('groups', { group_name: newGroupName, id: group_id },  idKey = "id");
  if (count == 2) {
    await dao.del('groups', group_id, idKey='id');
  }
  return ret;
}
