let fsp = require('node:fs/promises');


function listDirectory(dir) {
  return fsp.readdir(dir).then(names => {

    let res = []; 
    let promises = (names.map((name, i)=> {
      return fsp.stat(dir + name).then(stat => {
        if (stat.isFile()) {
          res.push(names[i]);
        } else if (stat.isDirectory()) {
          return listDirectory(dir + names[i] + '/').then(subDir => {
            res = res.concat(subDir);
            //在这里需要将当前结果和res合并处理
          })
        }
      })
    }))

    return Promise.all(promises).then(() => res)
  })

} 


listDirectory('./').then(val => {
  console.log(val);
})