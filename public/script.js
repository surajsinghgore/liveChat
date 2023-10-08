const socket = io("/");

// create room code 


    let username=sessionStorage.getItem('username')
    let gender=sessionStorage.getItem('gender')
    let roomcode=sessionStorage.getItem('roomcode')
  
//create chat room
socket.emit('join-chat',{username,roomcode,gender})


// not a valid Room Code

socket.on('not-valid-code',message=>{
  alert(message);

    window.location.href = "/createChat";

})

// maximum size reached
socket.on('maximum-size-reached',message=>{
  window.location.href = "/joinChat";
  alert(message);


})


// self welcome message to current user
socket.on("self-welcome", (username) => {
  var elements = document.getElementById("message_container");
  elements.innerHTML += `<div class="welcome">
  Hii <span>${username}</span>, Welcome to Chat 
</div>`;


socket.on('max-size-get',size=>{
  document.getElementById('maxsize').innerText=size;
sessionStorage.setItem('size',size);
})
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
 <span>${username} ,</span> Join the chat
</div>`;
});

// send message to server so that all users receive it
document.getElementById("forms").addEventListener("submit", (e) => {
  var audio = new Audio("send.mp3");
  audio.play();
  e.preventDefault();
console.log('new')
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
  window.setTimeout(function () {
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

socket.on("user-disconnect", async(data) => {
  const {alert,username}=data;
  if(alert){
  var audio = new Audio("userleft.mp3");
  await audio.play();
  var elements = document.getElementById("message_container");
  elements.innerHTML += `
<div class="newUserleft">
          <span>${username}, </span> Left the chat
        </div>`;

  }

});
