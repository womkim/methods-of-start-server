/**
 *  @author: womkim
 *  @date: 2017-04-05
 *  @comment: 
 *      使用gulp进行工程化处理
 *      使用browser-sync模块进行服务器创建并代理
 *      这里对HTML文件进行压缩处理
 *      可以使用 less 进行css编写，工具将会对less进行编译，自动兼容IE8+浏览器，并转换为css文件，自动压缩
 *      可以使用es6进行编码，工具使用babel进行代码编译，使用gulp-uglify进行代码压缩
 *      对图片文件将进行优化处理
 *      取消了代码检查
 */

'use strict';

const path = require('path'),
  url = require('url');

const gulp = require('gulp'),
  del = require('del'),
  gulpLoadPlugins = require('gulp-load-plugins'),   //使插件可以直接用，而不用一个个去引用
  jsxhint = require('jshint-jsx'),
  browserSync = require('browser-sync'),
  proxy = require('proxy-middleware');

const $ = gulpLoadPlugins();

const
  inputDir = 'src',
  jsDir = 'src/js/',
  htmlPath = 'src/*.html',
  jsPath = 'src/js/*.js',
  cssPath = 'src/css/*.css',
  lessPath = 'src/less/*.less',
  imgPath = 'src/images/*',
  outputDir = 'dist',
  tmpDir = 'dist/.tmp';

const proxyURL = 'https://gz.wpmeichu.com/api/';

//gulp默认入口，直接运行gulp可以打包文件
gulp.task('default', ['clean:dist'], () => 
  gulp.start('styles', 'html', 'scripts', 'images')
);


//使用browser-sync启动服务调试，可以自动刷新浏览器，并实现监听，配置详情：https://browsersync.io/docs/options
gulp.task('server', ['default'], () => {
  // const proxyOptions = url.parse('https://sy.wpmeichu.com:90/api/');   //使用代理
  const proxyOptions = url.parse(proxyURL);   //使用代理
  proxyOptions.route = '/api/';
  browserSync({
    files: [htmlPath, cssPath, jsPath, imgPath],
    notify: false,        //Don't show any notifications in the browser.
    logPrefix: 'My Project',
    // browser: 'firefox',      //默认是chrome IE是iexplore
    server: {
      baseDir: '.',   //默认地址为 http://localhost:3000
      // https: true,
      middleware: [ proxy(proxyOptions) ]
    }
  });

  gulp.watch([htmlPath], ['html', browserSync.reload]);   //这里在修改html文件时，需要保存两次浏览器才能正常显示？
  gulp.watch([cssPath], ['styles', browserSync.reload]);
  gulp.watch([jsPath], ['scripts', browserSync.reload]);
  gulp.watch([imgPath], ['imagemin', browserSync.reload]);
});

/*
  web前端相关文件优化
  下面依次是 html、css、js、images 文件的优化
*/

//html 优化
gulp.task('html', () => {
  return gulp.src(htmlPath)
    //对HTML文件进行优化，最小化，按需要使用
    .pipe($.if('*.html', $.htmlmin({
      removeComments: true,     //移除注释
      collapseWhitespace: true,   //移除空格
      collapseBooleanAttributes: true,  //属性值简写，如 readonly="readonly" => readonly
      removeAttributeQuotes: true,  //去除引用属性的引号
      removeRedundantAttributes: true,  //移除多余属性
      removeEmptyAttributes: true,  //移除空属性
      removeScriptTypeAttributes: true, //移除Script标签中的type
      removeStyleLinkTypeAttributes: true,  //移除link标签中的type
      minifyJS: true,   //压缩页面js
      minifyCSS: true   //压缩页面css
    })))
    //输出显示
    .pipe($.if('*.html', $.size({ title: 'html:', showFiles: true, gzip: true })))
    .pipe(gulp.dest(outputDir));
});

//css 优化
gulp.task('styles', ['eslint'], () => {
  //automatically prefix stylesheets根据设置浏览器版本自动处理浏览器前缀
  const AUTOPREFIXER_BROWSERS = [
    'last 3 versions',
    'ie >= 10',
    'ie_mob >= 10',
    'ff >= 30',
    'chrome >= 34',
    'safari >= 7',
    'opera >= 23',
    'ios >= 7',
    'android >= 4.4',
    'bb >= 10'
  ];

  return gulp.src([cssPath, lessPath])
      .pipe($.newer(outputDir + '/css'))    //观察输出目录是不是最新版本
      .pipe($.sourcemaps.init())
      .pipe($.less())
      .pipe($.autoprefixer(AUTOPREFIXER_BROWSERS))
      .pipe($.cleanCss({
        compatibility: 'ie8'
      }))
      .pipe($.if('*.css', $.sourcemaps.write('.')))
      .pipe(gulp.dest(outputDir + '/css'))
      .pipe($.size({ title: 'css:', showFiles: true, gzip: true}))
});

//js 优化（执行之前先检查js语法）
gulp.task('scripts', ['eslint'],  () => {
  return gulp.src(jsPath)
    .pipe($.plumber())    //遇到错误，继续执行，将错误信息只在console里提示
    .pipe($.sourcemaps.init())
    .pipe($.babel({
      presets: ['es2015'],
      plugins: ['transform-runtime']
    }))
    .pipe($.if('*.js', $.uglify({ //需要判断js文件，上面生成的map文件不能压缩，会报错"Unexpected token: punc (:) "
      preserveComments: 'linecse' //保留一些license注释信息
    }).on('error', e => {
      console.log(e);   //输出编译时的具体错误信息
    })))
    .pipe($.size({    //控制台输出
      title: 'scripts:',
      gzip: true,     //显示gzip的大小
      showFiles: true   //显示详细文件名
    }))
    .pipe($.if('*.js', $.sourcemaps.write('./')))
    .pipe(gulp.dest(outputDir + '/js'))
});

//images 优化
gulp.task('images', () => {
  return gulp.src(imgPath)
      .pipe($.imagemin({
        verbose: true,    //显示详细信息
        progressive: true,  //渐进
        interlaced: true  //交错
      }))
      .pipe(gulp.dest(outputDir + '/images'))
});


/*
  辅助功能
  包括：
    删除文件(夹)，del
    清除缓存，cache

*/

//删除文件
gulp.task('clean:dist', () => del(
  [outputDir],      //需要删除的文件目录，首先清空输出文件夹
  {
    dot: true   //删除 .dot 以.开头的文件
  }
));
gulp.task('clean:build', () => del(['build'], {dot: true}));

//清除cache
gulp.task('clear', done => {
  return $.cache.clearAll(done)
});

//JavaScript和CSS语法检查，使用eslint
gulp.task('eslint', () => 
  gulp.src([jsPath, cssPath])
    .pipe($.eslint({
          rules: {  //0,1,2分别为off,warn, error
            // "quotes": ["error", "double"], //字符串使用双引号
            // "no-console": 2,   //不允许出现控制台输出
            'no-alert': 2,
            'block-spacing' : ["error", "never"],
            // 'brace-style': ["error", "1tbs", { "allowSingleLine": true }],
              // 'strict': 2    //require or disallow strict mode directives
          },
          globals: [
              'jQuery',
              '$'
          ],
          envs: [   //参考http://eslint.org/docs/user-guide/configuring#specifying-environments
              'browser',
              'es6'   //关键在这里，可以检查es6语法
          ]
      }))
    .pipe($.eslint.format())
    .pipe($.eslint.failAfterError())
);

//版本号管理
gulp.task('revall', ['clean:build'], () => {
  return gulp.src('dist/**')
      .pipe($.revAll.revision({ 
        dontRenameFile: [/^\/favicon.ico$/g, /^\/index.html$/g],   //不重命名文件，使用正则匹配
        dontUpdateReference: [/^\/favicon.ico$/g, /^\/index.html$/g],    //全局不重命名文件，使用正则匹配
      }))
      .pipe(gulp.dest('build'))
      .pipe($.revAll.manifestFile())
      .pipe(gulp.dest('build'))
      .pipe($.revAll.versionFile())
      .pipe(gulp.dest('build'))
});

