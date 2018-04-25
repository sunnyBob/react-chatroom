module.exports = (req, res, next) => {
    res.sendData = (...args) => {
      switch (args.length) {
        case 0:
          res.send({code: '1', retList: [], message: 'success'});
          break;
        case 1:
          res.send({code: '1', retList: args[0], message: 'success'});
          break;
        case 2:
          res.send({code: args[0], retList: [], message: args[1]});
          break;
        case 3:
          res.send({code: args[0], retList: args[1], message: args[2]});
          break;
      }
    }
    next();
  }
