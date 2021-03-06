### 基于gulp创建服务器

使用gulp，意味着将使用自动化工具将前端页面进行工程化处理，这里虽然是基于gulp创建服务器，实际将实现gulp在项目开发过程中工程化处理的全部过程，包括创建并启动服务器，解析文件，对文件打包压缩，编码等过程，并支持实时更改，实时刷新等。

关于gulp的具体配置使用，之前已经写过类似文档，这里不再多述。

关于gulp的几种服务器启动方式，之前也写过一篇文档，这里只使用其中一种方式，即使用browse-sync模块进行服务器创建，该模块支持多终端预览，实时刷新等功能。

安装，只需要npm直接安装即可：

```node
npm install
```

启动，开发模式：

```node
npm run dev
```

打包：

```node
npm run build
```



#### 说明

- 这里关于端口和代理api的修改，默认端口为3000，工具会根据实际端口自动修改，如果端口被占用，将在该端口号上依次加一测试运行。这里api代理匹配的是网站全称，请在proxyURL变量值中加入全称+/api/

- 关于web文件地址，这里建议使用标准目录形式：

  /	根目录

  |---- src	源文件目录

  |---- dist	打包目录（会自动生成）

  |---- lib	引用的外部库文件目录

  |---- 其他

#### 注意

- 这里文件名没有取server，因为gulp文件规定为gulpfile.js。
- 在命令行直接输入gulp，这里的处理方式是将直接打包文件到dist，但不会对文件进行版本管理。
- 打包压缩的文件都有sourcemap。
- 代码有详细注释，应该比较容易看懂。
- **没有版本管理的文件在dist文件夹中，但运行`npm run build`命令后，会将有版本控制的文件生成到build文件夹下，但没有对文件中的`index.html`做版本控制。