this.addEventListener('message', e => {

  console.log(e);
  let data = e.data; 
  let re = data.re; 
  let string = data.string;
  let res = []; 
  let match; 
  while (match = re.exec(string)) {
    res.push(match);
    if (re.global === false) break;
  }
  postMessage(res);
})