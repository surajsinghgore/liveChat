//setup express server 
const express = require('express');
const path=require('path')
const { createServer } = require('node:http');
// 1.Integrating Socket.IO
const { Server } = require('socket.io');
const PORT = process.env.PORT || 8080;

const app = express();
const server = createServer(app);
app.use(express.static(path.resolve(__dirname, "public")));
// run socket.io server on app server
const io = new Server(server);

// handle home request
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname,'./index.html'))
});


// established connection
let users={};
let activeUserCount=0;
io.on('connection', (socket) => {
  // username get

  socket.on('new-user-join',data=>{
    activeUserCount++;
    socket.broadcast.emit('live-user-count',activeUserCount);
    // set username in object
users[socket.id]=data;

// notify every one that new user join the chat
socket.broadcast.emit('notify-new-user-to-all',data.username);
// send self message to new user itself
socket.emit('self-welcome',data.username);
socket.emit('self-count',activeUserCount);
  }) 



//message get from user and send to all connected users
socket.on('send-message',message=>{
socket.broadcast.emit('receive-message',{message,data:users[socket.id]})
})

// if connection disconnect
socket.on('disconnect', () => {
  if(activeUserCount<=0){
    activeUserCount=0;
  }else{
    activeUserCount--;
  }
  socket.broadcast.emit('live-user-count',activeUserCount);


  // disconnect event
  socket.broadcast.emit('user-disconnect',users[socket.id]);
});
  
});

server.listen(PORT, () => {
  console.log(`server running at http://localhost:${PORT}`);
});

