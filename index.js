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
  res.sendFile(path.join(__dirname,'./Join.html'))
});
// create chat
app.get('/createChat', (req, res) => {
  res.sendFile(path.join(__dirname,'./createChat.html'))
});
// join chat
app.get('/joinChat', (req, res) => {
  res.sendFile(path.join(__dirname,'./Join.html'))
});


// welcome to chat
app.get('/welcome', (req, res) => {
  res.sendFile(path.join(__dirname,'./index.html'))
});

// established connection
let users={};
let activeUserCount=0;
io.on('connection', (socket) => {

  activeUserCount++;
  // create private chat room
socket.on('create-new-room',data=>{
// const {chatName,size,roomNumer}=data;
users[socket.id]=data;


// response user after create room request
// socket.emit('room-create',data);

})


// join in private room
socket.on('join-chat',data=>{
  

  users[socket.id]=data;
const{username,roomcode}=data;
// ! join the separate chat
socket.join(roomcode);
// notify every one that new user join the chat
socket.broadcast.in(roomcode).emit('notify-new-user-to-all',username);
// send self message to new user itself
socket.emit('self-welcome',username);
socket.broadcast.in(roomcode).emit('self-count',activeUserCount);
socket.emit('self-count',activeUserCount);
socket.emit('join-success',data);
})

  


//message get from user and send to all connected users
socket.on('send-message',({messageInput,roomcode})=>{
socket.in(roomcode).emit('receive-message',{message:messageInput,data:users[socket.id]})
})

// if connection disconnect
socket.on('disconnect', () => {
  if(activeUserCount<=0){
    activeUserCount=0;
  }else{
    activeUserCount--;
  }
  var last = Object.keys(users).pop();
  if(users[last]){
    const {roomcode,username}=users[last];
    socket.broadcast.in(roomcode).emit('self-count',activeUserCount);
    socket.broadcast.in(roomcode).emit('user-disconnect',username);
    // disconnect event
    
  }
  // delete users[socket.id];
});
  


});

server.listen(PORT, () => {
  console.log(`server running at http://localhost:${PORT}`);
});

