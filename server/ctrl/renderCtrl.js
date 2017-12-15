const userService = require('../services/userService');
const jwt = require('jsonwebtoken');
const jwtConfig = require('../config/jwtConfig');

exports.findUser = async (req, res) => {
  const { name, passwd } = req.query;
  const user = {
    name,
    passwd,
  };
  const ret = await userService.findUser(user);
  if (ret[0].id) {
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
    res.sendData(0, '用户名或者密码错误');
  }
}
