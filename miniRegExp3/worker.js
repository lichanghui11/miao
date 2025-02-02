this.addEventListener('message', (e) => {
  let re = e.data.re, string = e.data.string;
  let res = [];
  let match;
  while (match = re.exec(string)) {
    res.push(match);
    if (re.global === false) break;
  }
  postMessage(res);
})