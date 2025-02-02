//获取udp模块；
let dgram = require('dgram');

//创建udp信箱， 套接字；
//创建一个IPv4的套接字； 
let socket = dgram.createSocket('udp4');

//让这个套接字绑定一个端口， 范围在两个字节以内： 0-65535；
//由于权限问题1024以上的端口是可以随意使用的； 
socket.bind(12345);

socket.send('发送信息', 12345, '127.0.0.1');

socket.on('message', (data, remoteInfo) => {
  //remoteInfo是远程发送方的信息； 
  //data时收到的数据； 

})