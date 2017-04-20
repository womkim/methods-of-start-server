const express = require('express')
const proxy = require('express-http-proxy')
const open = require('open')

let app = express()
let router = express.Router()

const PORT = process.env.PORT || 3000
const siteDir = '../test/';     // 设置网站文件目录
let apiProxy = proxy('gz.wpmeichu.com', {
  https: true,
  forwardPath: function (req,res) {
    return req._parsedUrl.path
  }
})

router.get('/', (req, res, next) => {
  req.url = 'index.html'
  next()
})

app.use('/api/*', apiProxy)
app.use('/image/*', apiProxy)

app.use(router)
app.use(express.static(siteDir))
app.listen(PORT)

console.log(`Server running at http://localhost:${PORT}/index.html`);

open(`http://localhost:${PORT}`, 'chrome');
