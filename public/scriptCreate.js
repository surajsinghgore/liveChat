const socket = io("/");
// access values from chat form
document.getElementById('createChatForm').addEventListener('submit',(e)=>{
    e.preventDefault();
    let username=document.getElementById('username').value.toLowerCase();
    let gender=document.getElementById('gender').value.toLowerCase();
    let size=document.getElementById('size').value;
let roomNumer=Math.floor(Math.random() * 899999 + 100000);
 
//create chat room
socket.emit('create-new-room',{username,size,roomNumer})


            sessionStorage.setItem('join',true)
            sessionStorage.setItem('username',username)
            sessionStorage.setItem('admin',true)
            sessionStorage.setItem('gender',gender)
            sessionStorage.setItem('roomcode',roomNumer)
            window.location.href = "/welcome";
      

})