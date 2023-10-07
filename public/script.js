const socket = io("/");

// create room code 


    let username=sessionStorage.getItem('username')
    let gender=sessionStorage.getItem('gender')
    let roomcode=sessionStorage.getItem('roomcode')
  
//create chat room
socket.emit('join-chat',{username,roomcode,gender})




// self welcome message to current user
socket.on("self-welcome", (username) => {
  var elements = document.getElementById("message_container");
  elements.innerHTML += `<div class="welcome">
welcome to Live Chat <span>${username}</span>
</div>`;
});

socket.on("live-user-count", (count) => {
  document.getElementById("countActiveusers").innerText = count;
});

socket.on("self-count", (count) => {
  document.getElementById("countActiveusers").innerText = count;
});
// notify every one that new user join the chat
socket.on("notify-new-user-to-all", async(username) => {
  var audio = new Audio("newuser.mp3");
  await audio.play();
  var elements = document.getElementById("message_container");
  elements.innerHTML += ` <div class="newUserjoin">
 <span>${username}</span> Join the chat
</div>`;
});

// send message to server so that all users receive it
document.getElementById("forms").addEventListener("submit", (e) => {
  var audio = new Audio("send.mp3");
  audio.play();
  e.preventDefault();

  setTimeout(() => {
    var elem = document.getElementById("message_container");
    elem.scrollTop = elem.scrollHeight;
  }, 10);

  let messageInput = document.getElementById("msg").value;
  socket.emit("send-message", {messageInput,roomcode});
  // sound

  var elements = document.getElementById("message_container");
  let time = new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
  elements.innerHTML += `
   <div class="msg right-msg">
   <div
    class="msg-img"
    style="background-image:  url(${
      gender.slice(0, 1) == "m" ? "boy.svg" : "girl.png"
    })"
   ></div>

   <div class="msg-bubble">
     <div class="msg-info">
       <div class="msg-info-name">YOU</div>
       <div class="msg-info-time">${time}</div>
     </div>
     <div class="msg-text">
     ${messageInput}

     </div>
   </div>
 </div>
   `;

  document.getElementById("msg").value = "";
});

// message receive which is send by any other connected user
socket.on("receive-message", (data) => {
  var audio = new Audio("receive.mp3");
  audio.play();
  window.setInterval(function () {
    var elem = document.getElementById("message_container");
    elem.scrollTop = elem.scrollHeight;
  }, 10);
  let { message } = data;
  let { username } = data.data;
  let { gender } = data.data;
  var elements = document.getElementById("message_container");
  let time = new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
  elements.innerHTML += `
   <div class="msg left-msg">
   <div
    class="msg-img"
    style="background-image: url(${
      gender.slice(0, 1) == "m" ? "boy.svg" : "girl.png"
    })"
   ></div>

   <div class="msg-bubble">
     <div class="msg-info">
       <div class="msg-info-name">${username}</div>
       <div class="msg-info-time">${time}</div>
     </div>

     <div class="msg-text">
      ${message}
     </div>
   </div>
 </div> `;
});

// user disconnect

socket.on("user-disconnect", (data) => {
  console.log(data)
  var audio = new Audio("userleft.mp3");
  audio.play();
  var elements = document.getElementById("message_container");
  elements.innerHTML += `
<div class="newUserleft">
          <span>${username}</span> Left the chat
        </div>`;
});


