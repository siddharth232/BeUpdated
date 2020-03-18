var socket=io.connect('http://localhost:3000');
var username='!{fromusername}';
socket.emit('new user',username);
console.log(username);
function Sendmsg(to,from){
    var message=document.getElementById('msginput').value;
    socket.emit('new user',from);
    console.log(from+":socket");
    console.log(message);
    socket.emit('send message',{message:message,to:to,from:from});
}

socket.on('new message',function(data){
    var messageroom=document.getElementById('messageroom');
    console.log(data+'as');
    
    messageroom.innerHTML+='<p>'+data+"</p>";
})