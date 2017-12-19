const userService = require('../services/userService');
const path = require('path');
const jwt = require('jsonwebtoken');
const jwtConfig = require('../config/jwtConfig');
const bcrypt = require('bcrypt');

exports.findUser = async (req, res) => {
  const { name, passwd } = req.query;
  
  const ret = await userService.findUser({name});
  
  if (ret[0].id && bcrypt.compareSync(passwd, ret[0].password)) {
    const firstSignIn = Date.now();
    const token = jwt.sign({
      name,
      userId: ret[0].id,
      firstSignIn,
    }, jwtConfig.secretKey, {
      expiresIn: jwtConfig.expiresIn,
    });
    res.cookie('token', token, {
      maxAge: 2592000000,//30天
      httpOnly: true
    });
    res.sendData(1, '登录成功');
  } else {
    res.sendData(0, '无效的用户名或密码');
  }
}

exports.addUser = async (req, res) => {
  const { username, password, age, sex, phone, email } = req.body;
  const searchRet = await userService.findUser({name: username})
  if (searchRet[0].id) {
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
    avatar: path.join(__dirname, '../avatar/default', sex ? `${sex}.jpg` : '男.jpg')
  };
  const ret = await userService.addUser(user);
  if (ret.affectedRows) {
    res.sendData('1', '注册成功');
  } else {
    res.sendData('0', '注册失败');
  }
}
