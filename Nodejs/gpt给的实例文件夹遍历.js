let fsp = require("node:fs/promises");

function listDirectory(dir) {
  return fsp
    .readdir(dir) // 读取目录
    .then((names) => {
      let res = []; // 用于存储文件名

      // 使用 Promise.all 来等待所有的异步操作完成
      let promises = names.map((name) => {
        const fullPath = dir + name; // 获取完整路径
        return fsp
          .stat(fullPath) // 获取文件或目录的状态
          .then((stat) => {
            if (stat.isFile()) {
              res.push(name); // 如果是文件，加入结果数组
            } else if (stat.isDirectory()) {
              // 如果是目录，递归调用 listDirectory
              return listDirectory(fullPath + "/") // 递归处理子目录
                .then((subDirFiles) => {
                  res = res.concat(subDirFiles); // 将子目录文件合并到结果中
                });
            }
          })
          .catch((err) => {
            console.error("Error reading file:", fullPath, err);
          });
      });

      // 使用 Promise.all 来确保所有的异步操作都执行完
      return Promise.all(promises).then(() => res); // 返回最终的文件列表
    })
    .catch((err) => {
      console.error("Error reading directory:", err);
      return []; // 出现错误时返回空数组
    });
}

// 调用并打印结果
listDirectory("./").then((val) => {
  console.log(val); // 输出最终的文件列表
});
