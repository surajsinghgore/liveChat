const socket = io("/");
// access values from chat form
document.getElementById('joinChat').addEventListener('submit',(e)=>{
    e.preventDefault();
    let username=document.getElementById('username').value.toLowerCase();
    let roomcode=document.getElementById('roomcode').value;
    let gender=document.getElementById('gender').value;
 
//create chat room
socket.emit('join-chat',{username,roomcode,gender})


    sessionStorage.setItem('join',true)
    sessionStorage.setItem('username',username)
    sessionStorage.setItem('gender',gender)
    sessionStorage.setItem('roomcode',roomcode)
    window.location.href = "/welcome";
    // window.location.href = "/welcome";
})
