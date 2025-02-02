let net = require('net');//请求一个tcp模块

let server = net.createServer(); //创建一个tcp服务对象

const port = 5555;
//让服务器在某端口侦听； 
server.listen(port, () => {
  console.log('Listening...', port);
})

let messages = [];
//服务器在收到一个连接请求时触发一个connection事件； 
server.on('connection', conn => {
  conn.on('data', data => {
    let request = data.toString();

    let [firstLine, ...headers] = request.split('\r\n');
    let [method, path] = firstLine.split(' ');
    let body = headers[headers.length - 1];
    let url = new URL(`http://www.myHostName.com:5555${path}`);
    console.log('全部: ', request);
    console.log('方法： ', method);
    console.log('路径: ', path);
    console.log('头部: ', headers);
    console.log('请求体: ', body);
    let subPath = url.pathname;

    console.log('url路径: ', subPath);
    if (method === 'POST' && subPath === '/example/lichanghui.html') {
      let res = parseQueryString(body);
      messages.push(res);
    }

    if (subPath === '/example/lichanghui.html') {
      conn.write('HTTP/1.1 200 Finally OK!!!\r\n');
      conn.write('Content-Type: text/html\r\n');
      conn.write('\r\n');
      conn.write(`
      <form  method="POST" action="/example/lichanghui.html">
        <p> Name: <input type="text" name="name"></p>
        <p> Message: <br> <textarea name="message"></textarea></p>
        <p><button type="submit">Send</button></p>
      </form>  
    `);
      for (let msg of messages) {
        conn.write(`
        <fieldset>
          <legend>${msg.name}</legend>
          ${msg.message}
        </fieldset>  
      `)
      }
      conn.end();
    } else {
      conn.write('HTTP/1.1 404 This doesn\'t work!\r\n');
      conn.write('Content-Type: text/html\r\n');
      conn.write('\r\n');
      conn.write('<h1>Page doesn\'t exist!</h1>')
    }
  })
})

// name=miao&message=yes%3F&a=1&a=2
function parseQueryString1(qString) {
  //自己写的
  let res = {};
  let pairs = qString.split('&');
  for (let item of pairs) {
    let pair = item.split('=');
    res[pair[0]] = decodeURIComponent(pair[1]);
  }
  return res;
}

function parseQueryString(qString) {
  //改进之后的
  return qString.split('&').reduce((obj, item) => {
    let [name, value] = item.split('=');
    obj[name] = decodeURIComponent(value);
    return obj;
  }, {})
}