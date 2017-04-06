/**
 *  @author: womkim
 *  @date: 2017-04-05
 *  @comment: 
 *      使用webpack进行工程化处理，创建服务器，并进行代理
 *      这里对HTML文件进行压缩处理
 *      可以使用 less 进行css编写，工具将会对less进行编译，自动兼容IE8+浏览器，并转换为css文件，自动压缩
 *      可以使用es6进行编码，工具使用babel进行代码编译，使用gulp-uglify进行代码压缩
 *      对图片文件将进行优化处理
 *      使用eslint进行代码检查
 */

'use strict';

const path = require('path');
const fs = require('fs');

const DEBUG = process.env.NODE_ENV === 'dev';		//定义是否为开发环境

const webpack = require('webpack');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const OpenBrowserPlugin = require('open-browser-webpack-plugin');

const port = 8080;
const url = 'http://localhost:'+port+'/';


//plugins 定义插件数组
const pluginsArr = [];
// pluginsArr.push(new webpack.optimize.UglifyJsPlugin({			//压缩js文件
// 					compress: { warnings: false },
// 					output: { comments: false }
// 				}));
pluginsArr.push(new webpack.optimize.CommonsChunkPlugin({		//提取公共模块
					name: 'commons',
					filename: 'js/commons.[hash:8].js'
					// chunks: ["A", "B"]
				}));
pluginsArr.push(new ExtractTextPlugin('css/[name].[chunkhash:8].css'));		//提取css，在浏览器中引用
pluginsArr.push(new webpack.optimize.OccurrenceOrderPlugin());		//The entry chunks have higher priority for file size.
pluginsArr.push(new webpack.optimize.DedupePlugin());		//代码量变大，复制依赖树中相同的文件，防止复制重复的代码到包中？
pluginsArr.push(new webpack.optimize.LimitChunkCountPlugin({maxChunks: 15}))	//Limit the maximum chunk count
pluginsArr.push(new webpack.optimize.MinChunkSizePlugin({minChunkSize: 10000}))	//Limit the minimum chunk size
pluginsArr.push(new webpack.ProvidePlugin({			//全局使用 $ 、 jQuery 等，而不用使用 require 和 import导入
				    $: "jquery",
				    jQuery: "jquery",
				    "window.jQuery": "jquery"
				}));
pluginsArr.push(new webpack.BannerPlugin('This file is created by qinjun'));	//文件头部添加一行注释
pluginsArr.push(new OpenBrowserPlugin({url : url})); //自动打开浏览器，进入地址
pluginsArr.push(new webpack.HotModuleReplacementPlugin());		//热替换模块，自动保存刷新
// pluginsArr.push(new HtmlWebpackPlugin({				//使用HTML模板
// 					filename: 'index.html',				//输出文件
// 					template: './src/index.html',
// 					inject: true,
// 					minify: {
// 						removeComments: true,
//         				collapseWhitespace: false
// 					},
// 					// hash: true,		//在引入的文件后面加哈希值
// 				}));


/*
//配置全局变量，作为插件使用
var definePlugin = new webpack.DefinePlugin({
  __DEV__: JSON.stringify(JSON.parse(process.env.BUILD_DEV || 'true')),
  __PRERELEASE__: JSON.stringify(JSON.parse(process.env.BUILD_PRERELEASE || 'false'))
});
pluginArr.push(definePlugin);
*/

const jsFile = getEntryAbs('src/js', 'js');
const htmlFile = getEntryAbs('src', 'html');
const jadeFile = getEntryAbs('src/jade', 'jade');

// for( var chunkName in htmlFile ){
// 	let conf = {
// 		filename: chunkName + '.html',
// 		template: htmlFile[chunkName],
// 		inject: true,
// 		minify: {
// 			removeComments: true,
// 			collapseWhitespace: false
// 		},
// 		chunks: ['commons', chunkName]
// 	};
// 	pluginsArr.push(new HtmlWebpackPlugin(conf));
// }

//使用jade模板引擎：
for( var chunkName in jadeFile ){
	let conf = {
		filename: chunkName + '.html',
		template: jadeFile[chunkName],
		inject: true,
		minify: {
			removeComments: true,
			collapseWhitespace: false
		},
		chunks: ['commons', chunkName]
	};
	pluginsArr.push(new HtmlWebpackPlugin(conf));
}

//配置导出
module.exports = {
	// devtool: "source-map",    //生成sourcemap,便于开发调试
	entry: jsFile,
	output: {
		path: path.resolve(__dirname, 'dist'),		//输出路径
		publicPath: '/dist/',				//HTML引用路径
		filename: 'js/[name].[hash:8].bundle.js',		//输出文件名，这个name为js文件对应的文件名，全局都是一样的
		chunkFilename: 'js/[id].[hash:8].chunk.js'
	},
	module: {
		loaders: [
			{ test: /\.js?$/, exclude: /node_nodules/, loader: 'babel' },
			{ test: /\.jade$/, loader: 'jade' },
			{ test: /\.css$/, loader: ExtractTextPlugin.extract('style-loader', 'css-loader') },		//提出css文件，合并到指定文件
			{ test: /\.less$/, loader: ExtractTextPlugin.extract("style-loader", "css-loader!less-loader") },	//提出less文件，合并到指定文件
			// { test: /\.css$/, loader: 'style!css' },
			// { test: /\.css$/, loaders: ['style', 'css'] },	//另外一种写法，数组方式
			// { test: /\.less$/, loaders: ['style', 'css', 'less']},
			// { test: /\.(png|jpg|gif)$/, loader: 'url!file', query: { limit: 8192, name: 'images/[name].[hash:8].[ext]' } },
			{
				test: /.*\.(gif|png|jpe?g|svg)$/i,
				loaders: [
					'file?hash=sha512&digest=hex&limit=8192&name=images/[name].[hash:8].[ext]',
					'image-webpack?{optimizationLevel: 7, interlaced: false, pngquant:{quality: "65-90", speed: 4}, mozjpeg: {quality: 65}}'
				]
			},
      		{ test: /\.(swf|ttf|eot|svg|woff(2)?)(\?[a-z0-9=&.]+)?$/, loader: 'file?limit=8192&name=css/iconfont/[name].[hash:8].[ext]' }
		]
	},
	plugins: pluginsArr,
	externals: {
		"jquery": "jQuery"			//不用加载，可以在外部使用
	},
	resolve:{
		extensions: ['', '.js', '.css', '.jade', '.less', '.jpg', '.png', '.scss', '.coffee'],
		alias: {
			lib: path.resolve(__dirname, "./lib/lib.js"),		//这个路径是以js文件为当前路径的地址，建议使用绝对地址
			womkim: path.resolve(__dirname, "./lib/womkim.js")
		}
	},
	devServer : {
		port: port,
		historyApiFallback : true,
        inline : true,
        hot : true,
        publicPath: "/dist/",
        // headers: { "X-Custom-Header": "yes" },
        stats: {
        	colors: true,
        },
        proxy: {
            '/api/*': {
                target: 'http://120.76.195.19:88/',  
                secure: false  
            }
        } 
    }
};

//获取文件入口，输入文件路径和文件类型
function getEntryAbs(dir, type) {
	var obj = {};
	fs.readdirSync(dir).forEach(function (file) {
		var fileName = file.replace(new RegExp('.'+type+'$'), "");
		var filePath = path.resolve(dir, file);
		if(fs.statSync(filePath).isFile() && file.substr(file.lastIndexOf('.')+1) == type) obj[fileName] = filePath;
	});
	return obj;
}