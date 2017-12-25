const path = require('path');
const ctrl = require('../ctrl/renderCtrl');
const tokenChecker = require('../utils/tokenChecker');

module.exports = function(router) {
  router.get('/api/login', ctrl.findUser);
  router.post('/api/register', ctrl.addUser);
  router.get('/api/friends', ctrl.showFriends);

  router.get('*', (req, res, next) => {
    const token = req.cookies && req.cookies.token || '';
    if (req.path !== '/login' && !tokenChecker(token)) {
      res.send("<script>window.location.href='/login'</script>")
    } else {
      res.sendFile(path.resolve(__dirname, '../index.html'));
    }
  });
  return router;
}
