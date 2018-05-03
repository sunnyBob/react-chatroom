const path = require('path');
const ctrl = require('../ctrl/renderCtrl');
const tokenChecker = require('../utils/tokenChecker');
const fs = require('fs');

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
  router.delete('/api/group', ctrl.delGroupMem);
  router.post('/api/group', ctrl.createGroup);
  router.post('/api/group/join', ctrl.joinGroup);
  router.post('/api/group/invite', ctrl.inviteToGroup);

  //user_group
  router.get('/api/user_group', ctrl.getUserOrGroup);

  //sign out
  router.get('/api/signout', ctrl.signOut);

  //download
  router.get('/download', (req, res, next) => {
    const fileName = req.query.name,
      currFile = path.join( __dirname, '/../upload/',fileName);
    let fReadStream;
    fs.exists(currFile, function(exist) {
      if(exist){
        res.set({
            "Content-type":"application/octet-stream",
            "Content-Disposition":"attachment;filename="+encodeURI(fileName)
        });
        fReadStream = fs.createReadStream(currFile);
        fReadStream.on("data",(chunk) => res.write(chunk,"binary"));
        fReadStream.on("end",function () {
            res.end();
        });
      }else{
        res.set("Content-type","text/html");
        res.send("file not exist!");
        res.end();
      }
    });
  });

  router.get('*', (req, res, next) => {
    const token = req.cookies && req.cookies.token || '';
    console.log(req.path);
    if (req.path !== '/login' && !tokenChecker(token)) {
      res.clearCookie('token');
      res.send("<script>window.location.href='/login'</script>");
    } else {
      if (req.path === '/video.html') {
        res.sendFile(path.resolve(__dirname, '../video.html'));
      } else if(/^\/upload\/*/.test(req.path)) {
        res.send({ code: '1' });
      } else {
        res.sendFile(path.resolve(__dirname, '../index.html'));
      }
    }
    next();
  });
  return router;
}
