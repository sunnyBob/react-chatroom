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
    const creater = await dao.query('groups.findCreater', { groupId });
    const manager = await dao.query('groups.findGroupManager', { groupId, limit: parseInt(limit), offset: parseInt(offset) });
    return [{
      creater,
      manager,
    }];
  } else if (type === '8') {
    const groupMem = await dao.query('groups.findGroupOrdinary', { userId, groupId, userName: userName && `%${userName}%`, limit: parseInt(limit), offset: parseInt(offset) });
    const groupMemCount = await dao.query('groups.findGroupOrdinaryCount', { userId, groupId, userName: userName && `%${userName}%`, limit: parseInt(limit), offset: parseInt(offset) });
    return [{
      ret: groupMem,
      count: groupMemCount[0]['count(1)'],
    }];
  } else if (type === '9') {
    const groupManager = await dao.query('groups.findGroupManager', { groupId, userName: userName && `%${userName}%`, limit: parseInt(limit), offset: parseInt(offset) });
    const groupManagerCount = await dao.query('groups.findGroupManagerCount', { groupId, userName: userName && `%${userName}%`, limit: parseInt(limit), offset: parseInt(offset) });
    return [{
      ret: groupManager,
      count: groupManagerCount[0]['count(1)'],
    }];
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
  groupName.match(/\d+/g) && await dao.update('groups', { group_name: newGroupName, id: group_id },  idKey = "id");
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
  const ret = groupName.match(/\d+/g) && await dao.update('groups', { group_name: newGroupName, id: group_id },  idKey = "id");

  return ret || [];
}

exports.deleteFromGroup = async (ids, group_id, groupName) => {
  const count = parseInt(groupName.match(/\d+/g)) - ids.length;
  const userCount = await dao.query('groups.findGroupUsersCount', { groupId: group_id});
  const newGroupName = `${groupName.split('(')[0]}(${count})`;
  let removeGroup  = false;
  if (userCount[0]['count(1)'] - 1 <= 2) {
    await dao.del('groups', group_id, idKey='id');
    removeGroup = true;
  }
  ids.forEach(async user_id => {
    await dao.execute('groups.delMember', { user_id, group_id });
    await dao.execute('groups.delManager', { user_id, group_id });
  });
  const ret = groupName.match(/\d+/g) && await dao.update('groups', { group_name: newGroupName, id: group_id },  idKey = "id");
  if (removeGroup) {
    return [0];
  } else {
    return ret || [];
  }
}

exports.updateGroupInfo = async (id, announce, group_name, introduce, group_avatar) => {
  const ret = await dao.update('groups', JSON.parse(JSON.stringify({ id, announce, group_name, introduce, group_avatar })), idKey="id")
  return ret;
}

exports.removeGroup = async (id) => {
  const ret = await dao.del('groups', id, idKey="id")
  await dao.execute('groups.delMember', { group_id: id });
  await dao.execute('groups.delManager', { group_id: id });
  return ret;
}

exports.addManager = async (user_id, group_id) => {
  const ret = await dao.insert('manager_group', { user_id, group_id });
  return ret;
}

exports.delManager = async (user_id, group_id) => {
  const ret = await dao.execute('groups.delManager', { user_id, group_id });
  return ret;
}
