const path = require('path');
const ctrl = require('../ctrl/renderCtrl');
const tokenChecker = require('../utils/tokenChecker');

module.exports = function(router) {
  router.get('/api/login', ctrl.findUser)

  router.get('*', (req, res, next) => {
    const token = req.cookies && req.cookies.token || '';
    if (!tokenChecker(token) && req.path !== '/login') {
      res.send("<script>window.location.href='/login'</script>")
    }
    res.sendFile(path.resolve(__dirname, '../index.html'))
  });
  return router;
}
