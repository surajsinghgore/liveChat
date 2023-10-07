const socket = io("/");
// access values from chat form
document.getElementById('createChatForm').addEventListener('submit',(e)=>{
    e.preventDefault();
    let chatName=document.getElementById('chatName').value.toLowerCase();
    let size=document.getElementById('size').value;
let roomNumer=Math.floor(Math.random() * 899999 + 100000);
 


})