let fsp = require('node:fs/promises');

async function listDirectory(dir) {
  let res = []; 
  let names = await fsp.readdir(dir);
  for (let name of names) {
    let stat = await fsp.stat(dir + name);
    if (stat.isFile()) {
      res.push(dir + name)
    } else if (stat.isDirectory()) {
      res.push(...await listDirectory(dir + name + '/'));
    }
  }
  return res;
}


let files = listDirectory('./');
console.log(files.then(val => {
  console.log(val);
}))