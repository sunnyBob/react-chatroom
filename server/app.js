const express = require('express');
const app = express();
const PORT = '3000';
const http = require('http').Server(app);
const io = require('socket.io')(http);
const path = require('path');
const routers = require('./routes/route');
const sendData = require('./utils/sendHelp');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

io.on('connection', (socket) => {
  console.log('a user connected');
  socket.emit('news', '1111')
});

app.use(express.static(path.join(__dirname, '..', 'client')));
app.use(sendData);
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));
app.use(bodyParser.json({ limit: '50mb' }));
app.use(cookieParser());
app.use(routers(express.Router()));
http.listen(PORT, () => {
  console.log(`server start on port ${PORT}`);
});
