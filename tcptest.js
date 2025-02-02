let net = require('net'); //TCP模块， 名字叫net;

let sever = net.createServer(); //创建TCP服务器对象； 

sever.listen(33355, () => console.log('Listening...')); //让服务器对象在某个端口侦听；

sever.on('connection', conn => {
  //可以读取远程数据和端口；
  console.log('检测到连接: ', conn.remoteAddress, conn.remotePort);

  conn.write('服务器向客户端发送的消息');//向连接方发送数据； 

  conn.on('data', data => {
    //data 不是字符串， 类似于Uint8Array， 可以toString(); 
    console.log(`收到了客户端: ${conn.remoteAddress} 的消息`, data.toString());
    conn.write(`服务器收到了消息， 这是服务器的回复`);
  })

  conn.on('end', () => {
    console.log('连接断开了');
  })
})