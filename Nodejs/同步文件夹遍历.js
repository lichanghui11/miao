let fs = require("node:fs");

function listDirectory(dir) {
  let res = [];
  let names = fs.readdirSync(dir);
  for (let name of names) {
    try {
      let stat = fs.statSync(dir + name);
      if (stat.isFile()) {
        res.push(dir + name);
      } else if (stat.isDirectory()) {
        res.push(...listDirectory(dir + name + '/'));
      }
    } catch (e) {
      console.warn("invalid directory: ", dir + name);
    }
  }
  return res;
}

console.log(listDirectory("./"));
