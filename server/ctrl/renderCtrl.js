const userService = require('../services/userService');
exports.findUser = async (req, res) => {
  const { name, passwd } = req.query;
  const user = {
    name,
    passwd,
  };
  const ret = await userService.findUser(user);
  if (ret[0]["count(*)"]) {
    res.send({
      code: '1',
      retList: [],
      message: 'success',
    })
  } else {
    res.send({
      code: '0',
      retList: [],
      message: 'failed',
    })
  }
}
