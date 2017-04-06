### webpack启动服务器

webpack是现阶段最好用也是使用最广的工程化工具，它几乎具备之前工具（包括gulp）的所有功能，并且比他们都要强大，目前非常流行的框架都是使用webpack这个工具，而且在使用时都是已经配置完好的，以单页面形式展现，但是对于一些传统项目的代码大多以多页面形式存在，如果不修改代码结构，要用到webpack就需要自己另行配置。

这里暂先挪用之前配置的webpack文件，使用的是1.x的版本，因为当时用的时候2.0刚出来，大部分人都是持观望态度，不敢轻易在项目中使用，所以使用的是1.x的版本。

webpack的热启动形式是将文件先保存到内存中，不像gulp必须先编译到目录中才可以访问，这样便提高了开发页面时的访问速度和修改速度。

webpack另一个强大之处在于它的插件系统，它拥有很强大的插件体系，很多工具的使用都是配合插件完成，webpack的插件几乎可以满足我们现阶段所有要求。

由于这里是前配置文件，只能满足当时项目处理，因此本次代码仅供参考，2.x版本的配置将在后续更新...





#### 参考文档：

http://www.cnblogs.com/tugenhua0707/p/4793265.html

https://github.com/lengziyu/learn-webpack

http://www.css88.com/doc/webpack2/
