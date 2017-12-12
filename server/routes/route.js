const path = require('path');
const ctrl = require('../ctrl/renderCtrl');
module.exports = function(router) {
  router.get('/api/login', ctrl.findUser)

  router.get('*', (req, res, next) => {
    res.sendFile(path.resolve(__dirname, '../index.html'));
  });
  return router;
}
