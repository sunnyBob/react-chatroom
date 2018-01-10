const userService = require('../services/userService');
const path = require('path');
const jwt = require('jsonwebtoken');
const jwtConfig = require('../config/jwtConfig');
const bcrypt = require('bcrypt');

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
    }]
    res.sendData(1, retList, '登录成功');
  } else {
    res.sendData(0, '无效的用户名或密码');
  }
}

exports.findUserById = async (req, res) => {
  const { id } = req.query;
  const ret = await userService.findUserById(id);
  if (Array.isArray(ret) && ret.length) {
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
    return;
  }

  const saltRounds = 10;
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

exports.showFriends = async (req, res) => {
  const { userId } = req.query;
  const ret = await userService.findFriend(userId);
  if (Array.isArray(ret) && ret.length) {
    res.sendData(1, ret, 'success');
  } else {
    res.sendData(0, ret), 'failed';
  }
}

exports.updateStatus = async (req, res) => {
  const { userId, status } = req.body;
  const ret = await userService.updateStatus(userId, status);
  if (Array.isArray(ret) && ret.length) {
    res.sendData(ret);
  } else {
    res.sendData(0, 'failed');
  }
}
