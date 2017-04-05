/**
 *  @author: womkim
 *  @date: 2017-04-05
 *  @comment: 
 *      使用koa模块创建启动服务器
 *      使用koa-proxy模块进行api代理
 *      本页面是基于原前端项目老大 @林惠强 给的源码改写
 *      由于koa版本升级，v2+版本的koa移除了原中间件处理方式(将不再支持koa-proxy和koa-static-server模块处理方式)，运行时将会提出警告，
 *      暂不影响使用，如不想看到警告，请暂先使用koa 1.2.4 版本，本次使用1.2.4版本，后续将进行更新改进
 */

'use strict'

const path = require('path');

const koa = require('koa'),
  proxy = require('koa-proxy'),
  staticServer = require('koa-static-server');

const open = require('open');

const app = new koa();

const PORT = process.env.PORT || 3000;
const siteDir = '../test/'
const proxyURL = 'https://gz.wpmeichu.com';

//把图片和数据接口代理到线上，即用本地的静态文件，用线上的图片和数据
app.use(proxy({
  host: proxyURL,
  match: /^\/(api|image)\//i
}));

//获取本地的静态文件
app.use(staticServer({
  rootDir : path.join(__dirname, siteDir)
}));

app.listen( PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/index.html`);
  open(`http://localhost:${PORT}`, 'chrome');
});




