let fs = require("node:fs");
let path = require("node:path");

function listDirectory(dir, callback) {
  let res = [];
  let count = 0;
  fs.readdir(dir, (err, names) => {
    if (names.length === 0) callback(res);
    names.forEach((name) => {
      fs.stat(dir + name, (err, stat) => {
        if (stat.isFile()) {
          res.push(dir + name);
          count++;
          if (count === names.length) callback(res);
        } else if (stat.isDirectory()) {
          listDirectory(dir + name + "/", (files) => {
            res.push(...files);
            count++;
            if (count === names.length) callback(res);
          });
        }
      });
    });
  });
}

listDirectory("./", (item) => {
  console.log(item);
});
