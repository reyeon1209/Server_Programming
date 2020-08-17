const express = require('express')
const app = express()
const port = 3000

var fs = require('fs');
var bodyParser = require('body-parser') // Third-party middleware
var compression = require('compression') // Third-party middleware
var indexRouter = require('./routes/index.js');
var topicRouter = require('./routes/topic.js');
var authRouter = require('./routes/auth.js');
var helmet = require('helmet');
var session = require('express-session');
var FileStore = require('session-file-store')(session);

app.use(helmet());
app.use(express.static('public')) // pyblic 디렉토리 안에서 static을 찾겠다
app.use(bodyParser.urlencoded({extended: false}))
app.use(compression())
app.use(session({
  secret: 'keyboard cat',   // 별도의 파일로 분리 후 버전 관리
  resave: false,
  saveUninitialized: true,
  store: new FileStore()
}))

app.get('*', function (request, response, next) { // Application-level middleware
    // 'get'방식으로 들어오는 '*'모든 요청에 대해서 파일 목록을 가져오는 middleware
    fs.readdir('./data', function (error, filelist) {
        request.list = filelist;
        next();
    });
  }
)

app.use('/', indexRouter);
app.use('/topic', topicRouter);
app.use('/auth', authRouter);

app.use(function (req, res, next) {
  res.status(404).send('Sorry cant find that!');
});

app.use(function (err, req, res, next) {
  console.error(err.stack)
  res.status(500).send('Something broke!')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})