//https://username:password@www.example.com:8080/path/to/resource?search=query#section

let url = 'https://username:password@www.example.com:8080/path/to/resource?search=query&name=char#section';
//                                                                         i
function parseURL(url) {
  let i = 0; 
  let res = {};
  res.query = {};
  res.host = {};

  let httpStart = i; 
  while (url[i] !== ':') i++;
  res.head = url.slice(httpStart, i);
  i += 3; // skip '://';

  let hostStart = i; 
  while (url[i] !== '/') i++;
  res.host.hostInfo = url.slice(hostStart, i);
  i++; // skip '/';
  parseHostInfo(res.host.hostInfo);
  
  if (i >= url.length) return res;

  //parse the host info:  username:password@www.example.com:8080 
  function parseHostInfo(url) {
    if (url.includes('@')) {
      let [userInfo, hostNames] = url.split('@');
      let [username, password] = userInfo.split(':');
      let [hostName, port] = hostNames.split(':');

      res.host.username = username; 
      res.host.password = password;
      
      res.host.port = port;
      res.host.host = hostName;
    } else {
      
      let [hostName, port] = url.split(':');
      res.host.port = port;
      res.host.host = hostName;
    }
  }


  let pathStart = i; 
  while (url[i] !== '?' && i < url.length) i++;
  res.pathInfo = url.slice(pathStart, i);
  i++; // skip '?';

  while (url[i] !== '#' && i < url.length) { 
    let [key, val] = parseValues(url); 
    res.query[key]= val;
  }
  
  i++; //skip '#';
  let hashStart = i;
  while (i < url.length) i++;
  res.hash = url.slice(hashStart, i);

  return res;

// let url = 'https://username:password@www.example.com:8080/path/to/resource?search=query&name=char#section';
  function parseValues(url) {
    let res = [];
    let qStart = i;
    while (url[i] !== '=') i++;
    res.push(url.slice(qStart, i));
    i++; // skip '=';

    let vStart = i;
    while (url[i] !== '&' && url[i] !== '#') i++;
    res.push(url.slice(vStart, i));

    if (url[i] === '&') i++; // skip '&';

    return res;
  }
}