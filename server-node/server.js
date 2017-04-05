/**
 *  @author: womkim
 *  @date: 2017-04-05
 *  @comment: 
 *      使用纯node内置模块启动服务器
 *      使用http-proxy模块进行api代理
 *      参考链接： http://www.cnblogs.com/shawn-xie/archive/2013/06/06/3121173.html
 *
 */

'use strict'

// 引入基本模块
const http = require('http'),
  fs = require('fs'),
  path = require('path'),
  url = require('url');

const httpProxy = require('http-proxy');    // 代理模块

const open = require('open');   // 为方便浏览页面，默认加载open模块，可以自动打开浏览器进行预览

const PORT = process.env.PORT || 3000;    // 设置监听端口，默认3000

const siteDir = '../test/';     // 设置网站文件目录

// 配置访问文件类型
const types = {
  "css": "text/css",
  "gif": "image/gif",
  "html": "text/html",
  "ico": "image/x-icon",
  "jpeg": "image/jpeg",
  "jpg": "image/jpeg",
  "js": "text/javascript",
  "json": "application/json",
  "pdf": "application/pdf",
  "png": "image/png",
  "svg": "image/svg+xml",
  "swf": "application/x-shockwave-flash",
  "tiff": "image/tiff",
  "txt": "text/plain",
  "wav": "audio/x-wav",
  "wma": "audio/x-ms-wma",
  "wmv": "video/x-ms-wmv",
  "xml": "text/xml"
}

// 使用http代理配置代理服务器
let proxy = httpProxy.createProxyServer({});
let proxyURL = 'https://gz.wpmeichu.com';

proxy.on('error', (err, req, res) => {
  res.writeHead(500, {'Content-Type': 'text-plain'});
  res.end('Something went wrong!')
})

// 创建服务器
let server = http.createServer(function (req, res) {

  let pathName = url.parse(req.url).pathname;
  if (pathName.charAt(pathName.length - 1) === '/') {
    pathName += pathName + 'index.html'     // 未设置访问文件路径时默认访问首页 index.html页面
  }
  //判断如果是接口访问，则通过proxy转发，这里设置的是检测到以/api或者/image开头的路径时，代理到线上服务器地址，从代理服务器获取资源
  if(/^\/(api|image)/i.test(pathName)){
    proxy.web(req, res, {target: proxyURL, secure: false});
    return;
  }
  let realPath = path.join(siteDir, pathName);    // 访问网站本地实际路径

  let ext = path.extname(realPath);
  ext = ext ? ext.slice(1) : 'unknow';      // 提取后缀名

  fs.exists(realPath, (exists) => {

    // 判断文件是否存在
    if (!exists) {

      res.writeHead(404, {'Content-Type': 'text/plain'});
      res.end(`This request URL: ${pathName} was not found on this server`);

    } else {

      // 当文件存在时，读取文件并渲染
      fs.readFile(realPath, 'binary', (err, file) => {

        if (err) {

          res.writeHead(500, {'Content-Type': 'text-plain'});
          res.end(err);

        } else {

          let contentType = types[ext] || 'text/plain';
          res.writeHead(200, {'Content-Type': contentType});
          res.write(file, 'binary');
          res.end();

        }

      });

    }

  })

});

server.listen(PORT, () => {

  console.log(`Server running at http://localhost:${PORT}`);
  open(`http://localhost:${PORT}`, 'chrome'); // 默认使用 Chrome 浏览器打开页面，可自行配置，'firefox' 为火狐浏览器， 'iexplore' 为IE浏览器

})