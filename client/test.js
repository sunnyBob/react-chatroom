const socket = io.connect('http://127.0.0.1:3000');
socket.on('news', (data) => {
  console.log(data);
  socket.emit('my other event', { my: 'data' });
});
