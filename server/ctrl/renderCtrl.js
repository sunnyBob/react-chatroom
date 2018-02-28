const { userService, msgService, inviteService } = require('../services');
const path = require('path');
const jwt = require('jsonwebtoken');
const jwtConfig = require('../config/jwtConfig');
const bcrypt = require('bcrypt');

const saltRounds = 10;

exports.findUser = async (req, res) => {
  const { name, passwd } = req.query;
  const ret = await userService.findUser({name});
  const { id, password, avatar } = ret[0] || {};
  if (bcrypt.compareSync(passwd, password)) {
    const firstSignIn = Date.now();
    const token = jwt.sign({
      name,
      userId: id,
      firstSignIn,
    }, jwtConfig.secretKey, {
      expiresIn: jwtConfig.expiresIn,
    });
    res.cookie('token', token, {
      maxAge: 2592000000,//30天
      httpOnly: true
    });
    const retList = [{
      userName: name,
      userId: id,
      avatar,
    }];
    res.sendData(1, retList, '登录成功');
  } else {
    res.sendData('5000', '无效的用户名或密码');
  }
}

exports.findUserById = async (req, res) => {
  const { id } = req.query;
  const ret = await userService.findUserById(id);
  if (Array.isArray(ret)) {
    res.sendData(1, ret, 'success');
  } else {
    res.sendData(0, ret), 'failed';
  }
}

exports.addUser = async (req, res) => {
  const { username, password, age, sex, phone, email, avatar } = req.body;
  const searchRet = await userService.findUser({name: username});
  if (searchRet.length && searchRet[0].id) {
    res.sendData('5000', '用户名已经被占用');
  } else {
    const hash = bcrypt.hashSync(password, saltRounds);
    const user = {
      username,
      password: hash,
      age,
      sex,
      email,
      phone,
      avatar,
    };
    const ret = await userService.addUser(user);
    if (ret.affectedRows) {
      res.sendData('1', '注册成功');
    } else {
      res.sendData('0', '注册失败');
    }
  }
}

exports.updateUserInfo = async (req, res) => {
  const user = req.body;
  const { password, originPasswd, name} = user;
  if (password && originPasswd) {
    const ret = await userService.findUser({name});
    const { password: nowPassword, id } = ret[0] || {};
    if (bcrypt.compareSync(originPasswd, nowPassword)) {
      delete user.originPasswd;
      const ret = await userService.updateUserInfo(user);
      if (ret.affectedRows) {
        res.sendData(ret);
      } else {
        res.sendData(0, 'failed');
      }
    } else {
      res.sendData('5000', '原始密码不正确');
    }
  } else {
    const ret = await userService.updateUserInfo(user);
    if (ret.affectedRows) {
      res.sendData(ret);
    } else {
      res.sendData(0, 'failed');
    }
  }
}

//friend
exports.showFriends = async (req, res) => {
  const { userId } = req.query;
  const ret = await userService.findFriend(userId);
  if (Array.isArray(ret)) {
    res.sendData(1, ret, 'success');
  } else {
    res.sendData(0, ret, 'failed');
  }
}

exports.addFriend = async (req, res) => {
  const { userId, friendId } = req.body;
  const ret = await userService.addFriend(userId, friendId);
  if (ret.affectedRows) {
    res.sendData('1', '添加好友成功');
  } else {
    res.sendData('0', '添加好友失败');
  }
}

exports.deleteFriend = async (req, res) => {
  const { friendId, userId } = req.body;
  const ret = await userService.deleteFriend(userId, friendId);

  if (ret.affectedRows) {
    res.sendData('1', '删除好友成功');
  } else {
    res.sendData('0', '删除好友失败');
  }
}

// message
exports.addMsg = async (req, res) => {
  const { from_user, to_user, content } = req.body;
  const msgInfo = { from_user, to_user, content };
  const ret = await msgService.addMsg(msgInfo);
  if (ret.affectedRows) {
    res.sendData('1', '发送成功');
  } else {
    res.sendData('0', '发送失败');
  }
}

exports.getMsg = async (req, res) => {
  const { fromUser, toUser } = req.query;
  const ret = await msgService.getMsg(fromUser, toUser);
  if (Array.isArray(ret)) {
    res.sendData('1', ret, '消息查询成功');
  } else {
    res.sendData('0', ret, '消息查询失败');
  }
}

//invitation
exports.sendInvitation = async (req, res) => {
  const { user_id, friend_id, username, invite_type } = req.body;
  const searchRet = await inviteService.getInvitation(friend_id, user_id);
  if (searchRet.length && searchRet[0].id) {
    res.sendData('5000', '已发送过好友申请');
  } else {
    const invitation = {
      user_id,
      friend_id,
      username,
      invite_type,
    };
    const ret = await inviteService.sendInvitation(invitation);
    if (ret.affectedRows) {
      res.sendData('1', '发送成功');
    } else {
      res.sendData('0', '发送失败');
    }
  }
}

exports.getInvitation = async (req, res) => {
  const {friend_id, invite_type } = req.query;
  const searchRet = await inviteService.getInvitation(friend_id, invite_type);
  if (Array.isArray(searchRet)) {
    res.sendData('1', searchRet, '查询成功');
  } else {
    res.sendData('0', searchRet, '查询失败');
  }
}

exports.deleteInvitation = async (req, res) => {
  const { friendId, userId, groupId } = req.body;
  const ret = await inviteService.deleteInvitation(friendId, userId, groupId);

  if (ret.affectedRows) {
    res.sendData('1', '删除申请成功');
  } else {
    res.sendData('0', '删除申请失败');
  }
}

//sign out
exports.signOut = async (req, res) => {
  res.clearCookie('token');
  res.sendData('1', '登出成功');
}
