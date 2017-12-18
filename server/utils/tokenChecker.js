const jwt = require('jsonwebtoken');
const jwtConfig = require('../config/jwtConfig');

module.exports = (token) => {
  let isvalaid = true;
  //验证思想：解析 用secretKey再加密 对比
  jwt.verify(token, jwtConfig.secretKey, function(err, decoded) {
    if (err) {
      console.log(err.message);
      isvalaid = false;
    }
  });
  return isvalaid;
}
