//setup express server
const express = require("express");
const path = require("path");
const { createServer } = require("node:http");
// 1.Integrating Socket.IO
const { Server } = require("socket.io");
const PORT = process.env.PORT || 8080;

const app = express();
const server = createServer(app);
app.use(express.static(path.resolve(__dirname, "public")));
// run socket.io server on app server
const io = new Server(server);

// handle home request
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "./Join.html"));
});
// create chat
app.get("/createChat", (req, res) => {
  res.sendFile(path.join(__dirname, "./createChat.html"));
});
// join chat
app.get("/joinChat", (req, res) => {
  res.sendFile(path.join(__dirname, "./Join.html"));
});

// welcome to chat
app.get("/welcome", (req, res) => {
  res.sendFile(path.join(__dirname, "./index.html"));
});

// established connection
let users = {};
let roomcodecreated = [];
io.on("connection", (socket) => {
  // create private chat room
  let disconnectMsg=true;
  socket.on("create-new-room", (data) => {
    const { size, roomcode } = data;
    // users[socket.id]=data;
    roomcodecreated.push({ roomcode, size });
    // socket.join(roomcode);
  });

  // join in private room
  socket.on("join-chat", async (data) => {
    users[socket.id] = data;
    const { username, roomcode } = data;

    // check whether valid Code Or Not
    let checkValidCodeOrNot = false;
    let maxSizeOfRoom = 1;
    for (let i = 0; i < roomcodecreated.length; i++) {
     
      socket.emit("normal", roomcodecreated[i]);
      if (roomcodecreated[i].roomcode == roomcode) {
        checkValidCodeOrNot = true;
        maxSizeOfRoom = Number(roomcodecreated[i].size);
      }
    }

    if (checkValidCodeOrNot) {
      let currentSizeOfRoom = (await io.in(roomcode).fetchSockets()).length;
       currentSizeOfRoom++;

      // maximum size of room check
      if (currentSizeOfRoom<=maxSizeOfRoom) {
       
        // ! join the separate chat
        socket.join(roomcode);
        const countNumberOfUsersInRoom = (await io.in(roomcode).fetchSockets())
          .length;
        // notify every one that new user join the chat
        socket.broadcast.in(roomcode).emit("notify-new-user-to-all", username);
        // send self message to new user itself
        socket.emit("self-welcome", username);
        socket.emit("max-size-get", maxSizeOfRoom);
  
        socket.broadcast
          .in(roomcode)
          .emit("self-count", countNumberOfUsersInRoom);
        socket.emit("self-count", countNumberOfUsersInRoom);
        socket.emit("join-success", data);
      }
      // size is more
      else {
    
        disconnectMsg=false
        let message = "Chat Room IS Full";
        socket.emit("maximum-size-reached", message);
       
      }
    }
    // chat Code Is Invalid
    else {

      let message = "Invalid Chat Code";
      socket.emit("not-valid-code", message);
    }
  });


 
  //message get from user and send to all connected users
  socket.on("send-message", ({ messageInput, roomcode }) => {
    socket
      .in(roomcode)
      .emit("receive-message", {
        message: messageInput,
        data: users[socket.id],
      });
  });


  // if connection disconnect
  socket.on("disconnect", async () => {
    if (users[socket.id] != undefined) {
      const { roomcode, username } = users[socket.id];
      const countNumberOfUsersInRoom = (await io.in(roomcode).fetchSockets())
        .length;

      socket.broadcast
        .in(roomcode)
        .emit("self-count", countNumberOfUsersInRoom);
      socket.broadcast.in(roomcode).emit("user-disconnect", {username,alert:disconnectMsg});
      // disconnect event
    }
    // delete users[socket.id];
  });

});

server.listen(PORT, () => {
  console.log(`server running at http://localhost:${PORT}`);
});
