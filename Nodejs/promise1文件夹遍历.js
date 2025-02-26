let fsp = require("node:fs/promises");

function listDirectory(dir) {
  return fsp.readdir(dir).then((names) => {
    return Promise.all(
      names.map((name) => {
        return fsp.stat(dir + name).then((stat) => {
          if (stat.isFile()) {
            return name;
          } else if (stat.isDirectory()) {
            return listDirectory(dir + name + "/").then((subFiles) => {
              return subFiles
            })
          }
        });
      })
    ).then((result) => {
      return result.flat();
    })
  });
}

listDirectory("./").then((files) => console.log(files));
