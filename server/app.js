const express = require('express');
const app = express();
const PORT = '3000';
const path = require('path');
const routers = require('./routes/route');
const sendData = require('./utils/sendHelp');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const options = {
  key: fs.readFileSync('./cert/privatekey.pem'),
  cert: fs.readFileSync('./cert/certificate.pem')
};
const https = require('https').Server(options, app);
const io = require('socket.io')(https);

const userSocket = {};
const onlineUsers = {};
let token = '';

app.use(express.static(path.join(__dirname, '..', 'client')));
app.use(sendData);
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));
app.use(bodyParser.json({ limit: '50mb' }));
app.use(cookieParser());
app.use(routers(express.Router()));
app.get('*', (req, res, next) => {
  token = req.cookies && req.cookies.token;
})
https.listen(PORT, () => {
  console.log(`server start on port ${PORT}`);
});

io.on('connection', (socket) => {
  const user = jwt.decode(token) || {};
  user.userId && (userSocket[user.userId] = socket);
  user.userId && (onlineUsers[user.userId] = user.name);
  
  socket.on('login', userId => {
    userId && (userSocket[userId] = socket);
    userId && (onlineUsers[userId] = user.name);
  });

  socket.on('updateStatus', userId => {
    io.emit('updateStatus', userId);
  });

  socket.on('updateLeftList', userId => {
    if (userSocket.hasOwnProperty(userId)) {
      userSocket[userId].emit('updateLeftList');
    }
  });

  socket.on('updateInvitation', userId => {
    if (userSocket.hasOwnProperty(userId)) {
      userSocket[userId].emit('updateInvitation');
    }
  });

  socket.on('chatToOne', (msg, fromUser, toUser) => {
    if (userSocket.hasOwnProperty(toUser)) {
      userSocket[toUser].emit('chatToOne', msg, fromUser);
    }
  });

  socket.on('chatToMore', (msg, userId, groupId, avatar) => {
    io.to(`room-${groupId}`).emit('chatToMore', msg, userId, groupId, avatar);
  });

  socket.on('addToRoom', (ids, groupId, cb) => {
    ids.forEach(id => {
      if (userSocket.hasOwnProperty(id)) {
        userSocket[id].join(`room-${groupId}`);
      }
    });

    io.to(`room-${groupId}`).emit('updateGroupList');
  });

  socket.on('updateGroupUser', (groupId) => {
    io.to(`room-${groupId}`).emit('updateGroupUser', groupId);
  });

  socket.on('joinRoom', (userId, roomName) => {
    if (userSocket.hasOwnProperty(userId)) {
      userSocket[userId].join(roomName);
    }
  });
});
