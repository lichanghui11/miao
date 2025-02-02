function makeRequest(method, path, headers, body = '') {
  let xhr = new XMLHttpRequest();
  xhr.open(method, path, false);
  //false 表示同步， 等待加载完成; true 表示异步， 不会等待结果， 直接返回
  //默认为true
  for (let head in headers) {
    let value = headers[head]; 
    xhr.setRequestHeader(header, value);
  }
  xhr.send(body); 
  
  return xhr.responseText;
}


//可以请求一个可以获取IP地址的网站： https://api.ipify.org/

//模拟迅雷下载链接： 
function download(url, func) {
  let xhr = new XMLHttpRequest();
  xhr.open('GET', url);
  xhr.send();
  xhr.onload = () => {
    func(xhr.responseText)
  }
}