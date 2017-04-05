### 使用koa创建服务器

#### 代码功能：

*      使用koa模块创建启动服务器
*      使用koa-proxy模块进行api代理
*      本页面是基于原前端项目老大 @林惠强 给的源码改写
*      由于koa版本升级，koa移除了原中间件处理方式，代码将会提出警告，暂不影响使用，如不想看到警告，请暂先使用koa 1.2.4 版本，后续将进行改进

#### 相关说明：

- 具体修改建议与原生node[修改建议](../server-node/readme.md)一样
- koa是比express更轻量级的node应用，详情：https://github.com/koajs/koa/blob/master/docs/koa-vs-express.md
- ​