const path = require('path');
const ctrl = require('../ctrl/renderCtrl');
const tokenChecker = require('../utils/tokenChecker');

module.exports = function(router) {
  router.get('/api/login', ctrl.findUser);

  //friend
  router.get('/api/friends', ctrl.showFriends);
  router.post('/api/friends', ctrl.addFriend);
  router.delete('/api/friends', ctrl.deleteFriend);


  //user
  router.get('/api/user', ctrl.findUserById);
  router.post('/api/user', ctrl.addUser);
  router.put('/api/user', ctrl.updateUserInfo);

  //message
  router.get('/api/message', ctrl.getMsg);
  router.post('/api/message', ctrl.addMsg);

  //invitation
  router.get('/api/invitation', ctrl.getInvitation);
  router.post('/api/invitation', ctrl.sendInvitation);
  router.delete('/api/invitation', ctrl.deleteInvitation);

  //group
  router.get('/api/group', ctrl.getGroupInfo);
  router.post('/api/group', ctrl.createGroup);
  router.post('/api/group/join', ctrl.joinGroup);

  //user_group
  router.get('/api/user_group', ctrl.getUserOrGroup)

  //sign out
  router.get('/api/signout', ctrl.signOut);

  router.get('*', (req, res, next) => {
    const token = req.cookies && req.cookies.token || '';
    if (req.path !== '/login' && !tokenChecker(token)) {
      res.clearCookie('token');
      res.send("<script>window.location.href='/login'</script>")
    } else {
      res.sendFile(path.resolve(__dirname, '../index.html'));
    }
    next();
  });
  return router;
}
