const express = require('express');
const app = express();
const PORT = '3000';
const http = require('http').Server(app);
const io = require('socket.io')(http);
const path = require('path');
const routers = require('./routes/route');

io.on('connection', function(socket){
  console.log('a user connected');
  socket.emit('news', '1111')
});

app.use(express.static(path.join(__dirname, '..', 'client')));
app.use(routers(express.Router()))
http.listen(PORT, () => {
  console.log(`server start on port ${PORT}`);
});
