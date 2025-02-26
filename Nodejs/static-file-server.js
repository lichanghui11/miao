/**
 * 文件夹路径末尾没有斜杠， 需要跳转到带有斜杠的地址
 * url中如果带有querystring， querystring是不能作为文件名的， 需要去掉querystring
 * 如果url对应文件夹，  列出文件夹内容
 * 文件内容区分文件与文件夹， 将文件夹排在前面， 文件需要显示大小
 * 除了根目录外， 每个目录都要显示一个回到上级目录的链接
 * 文件夹中如果有index.html文件， 则返回这个文件， 而不是列出文件内容
 * 为了正确显示文件中的中文字符， 需要正确处理url编码
 * 为每个文件的响应给出合适的content-type响应头以表示文件的媒体类型
 */

const fs = require("node:fs");
const fsp = fs.promises;
const http = require("node:http");
const path = require("node:path");
const mime = require("mime-types");

const server = http.createServer();
const PORT = 8888;
const baseDir = process.argv[2] ?? "./";

//在这里定义一个格式化文件大小的函数
function formatFileSize(size) {
  if (size < 1024) {
    //B 为单位
    return size + "B";
  } else if (size < 1024 * 1024) {
    //KB 为单位
    return (size / 1024).toFixed(2) + "KB";
  } else if (size < 1024 * 1024 * 1024) {
    //MB 为单位
    return (size / 1024 / 1024).toFixed(2) + "MB";
  } else if (size < 1024 * 1024 * 1024 * 1024) {
    //GB 为单位
    return (size / 1024 / 1024 / 1024).toFixed(2) + "GB";
  }
}

//在这里定义一个格式化时间的函数
function formatDate(timeStamp) {
  let data = new Date(timeStamp);
  let year = data.getFullYear();
  let month = data.getMonth().toString().padStart(2, 0);
  let day = data.getDate().toString().padStart(2, 0);
  let hours = data.getHours().toString().padStart(2, 0);
  let minutes = data.getMinutes().toString().padStart(2, 0);
  let seconds = data.getSeconds().toString().padStart(2, 0);
  return `${hours}:${minutes}:${seconds} ${year}-${month}-${day}`;
}

server.on("request", async (req, res) => {
  //处理请求中的url
  let originalUrl = new URL("http://localhost" + req.url);

  const targetPath = path.join(baseDir, originalUrl.pathname);
  console.log(
    req.method,
    decodeURIComponent(req.url),
    decodeURIComponent(targetPath)
  );

  //在这里判断是否有query string, 如果有， 需要处理后直接返回
  //写到这里的时候没有进行特殊处理

  try {
    const stat = await fsp.stat(decodeURIComponent(targetPath));
    if (stat.isFile()) {
      const fileData = await fsp.readFile(decodeURIComponent(targetPath));
      res.writeHead(200, {
        "content-type": mime.contentType(
          path.extname(decodeURIComponent(targetPath))
        ),
      });
      res.write(fileData);
      res.end();
    } else if (stat.isDirectory()) {
      try {
        if (!originalUrl.pathname.endsWith("/")) {
          res.writeHead(302, {
            Location: originalUrl.pathname + "/" + originalUrl.search,
            "Content-Type": "text/html; charset=utf-8",
          });
          res.end();
          return;
        }

        //在这里判断文件夹里面是否有index.html的文件
        //文件夹的名称也有可能被命名为index.html

        try {
          const indexPath = path.join(
            decodeURIComponent(targetPath),
            "index.html"
          );
          const indexStat = await fsp.stat(indexPath);
          if (indexStat.isFile()) {
            const indexFile = await fsp.readFile(indexPath);
            res.writeHead(200, {
              "Content-Type": "text/html; charset=utf-8",
            });
            res.end(indexFile);
            return;
          } else if (indexStat.isDirectory()) {
            res.setHeader({
              "content-type": "text/html; charset=utf8",
            });
            res.end();
          }
          /**
           * 在上面的代码中如果没有加入else if (indexStat.isDirectory()) 这个分支，服务器就进入了死循环
            *为什么会发生死循环：
              •	符号链接（软链接和硬链接）：符号链接是指向另一个文件或目录的引用。假设你访问的路径是一个符号链接，并且该符号链接指向自己或循环引用的其他路径，那么 fsp.stat() 会返回该符号链接的信息，并且可能会导致反复处理该路径，陷入死循环。
              •	目录与文件的判断问题：当路径是符号链接时，fsp.stat() 可能会返回错误的判断结果，特别是当链接指向一个目录时，它可能会被误认为是文件，或在某些情况下无法正确判断文件类型。
            为什么加入 else if 分支后会解决问题：
              •	条件判断：通过加入 else if 来显式区分符号链接的文件和目录，代码变得更加健壮。对于符号链接的路径，你能够准确判断它是目录还是文件，并根据实际情况处理，从而避免了死循环。
              •	返回响应：在正确判断路径类型后，给客户端返回合适的响应头（如 Content-Type: text/html），确保浏览器能正确处理文件夹的内容，而不是陷入持续请求的状态。
            *解决方案总结：
              1.	符号链接：对于符号链接，fsp.stat() 返回的信息可能并不完全符合你的预期，尤其是在符号链接指向文件夹或目录的情况下。你需要确保在处理符号链接时，能够正确判断并避免陷入死循环。
              2.	路径类型判断：通过明确的条件判断（例如通过 else if 判断符号链接），你可以确保代码在处理路径时更加准确。
              3.	返回正确的响应头：在正确判断了路径类型之后，使用适当的响应头来确保客户端能够正确处理响应内容。 
          */
        } catch (e) {
          //const fileNames = await fsp.readdir(targetPath);
          //此处fileNames 是一个数组
          //如果使用这个方法则需要使用计数器
          const fileEntries = await fsp.readdir(
            decodeURIComponent(targetPath),
            {
              withFileTypes: true,
            }
          );

          //这里对文件与文件夹进行排序
          const sortedEntries = fileEntries.sort((a, b) => {
            if (a.isDirectory() && b.isFile()) return -1; //文件夹在前面则顺序不变
            if (a.isFile() && b.isDirectory()) return 1; //文件夹在后面则往前面挪一位
            return 0; //同类型顺序则不变
          });

          //这里判断是否需要返回上一层文件夹
          let isBaseDir = "";
          if (originalUrl.pathname !== "/") {
            isBaseDir = '<thead><a href="../">../</a></thead>';
          }
          //此处fileEntries是一个条目集合
          //这里不需要使用计数器
          const htmlPromises = sortedEntries.map(async (file) => {
            const sep = file.isFile() ? "" : "/";
            const logo = file.isFile()
              ? `/Nodejs/logos/file.jpeg`
              : `/Nodejs/logos/directory.jpeg`;
            let stat = await fsp.stat(
              path.join(decodeURIComponent(targetPath), file.name)
            );
            let size = file.isFile() ? formatFileSize(stat.size) : "";
            let time = formatDate(stat.mtimeMs);
            return `
              <tr>
                <td><img src="${logo}" alt="${
              file.isFile() ? "file" : "directory"
            }"/></td><td>${time}</td><td>${size}</td><td><a href="${
              file.name + sep
            }">${file.name + sep}</a></td>
              </tr>
            `;
          });
          const html = await Promise.all(htmlPromises);
          const page = `
          <h1>Index of ${decodeURIComponent(originalUrl.pathname)}</h1>
          <table>
            ${isBaseDir}
            <tr><td>文件图标</td><td>文件最后修改时间</td><td>文件大小</td><td>文件名称</td></tr>
            ${html.join("")}
          </table>
          <p><address>Node.js ${
            process.version
          }/ http-server server running @ 192.168.3.6:${PORT}</address></p>
        `;
          res.writeHead(200, {
            "Content-Type": "text/html; charset=utf-8",
          });
          res.write(page);
          res.end();
        }
      } catch (e) {
        res.writeHead(404);
        res.write("Error happened during render the page....");
        res.end();
      }
    }
  } catch (e) {
    res.write("Page not found!!!!!!");
    res.end();
  }
});

server.listen(8888, () => {
  console.log("listening...on: ", PORT);
  console.log("serving: ", baseDir);
});
