### 原生node启动服务器

使用node内置模块创建一个web服务器，并渲染web文件。

node内置模块不需要安装，这里代码中使用了http-proxy模块，用于代理后端服务器api接口；使用open模块插件，用于自动打开浏览器。所以需要安装http-proxy模块和open模块，这里已经集成在package.json文件中，可以直接install：

```node
npm install
```

安装完成后，启动服务器：

```node
npm run dev
```



server.js中对根目录，端口，api代理等进行了默认配置，可根据需要自行修改。

- 默认的服务器解析路径为根目录下的test目录，修改siteDir的值。
- 默认端口设置为3000，可以直接在启动是配置环境变量PORT设置端口，或者在代码中修改PORT的值。
- 默认情况下当连接api路径时自动代理到后端服务器接口，这里测试设置为http://192.168.1.210，需根据实际地址配置（同样的方法可以代理图片地址），修改proxyURL的值。



参考网站：

http://www.cnblogs.com/shawn-xie/archive/2013/06/06/3121173.html

http://www.jb51.net/article/106932.htm

http://www.tuicool.com/articles/IFbaY3