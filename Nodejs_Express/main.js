const express = require('express')
const app = express()
const port = 3000

const fs = require('fs');
const bodyParser = require('body-parser') // Third-party middleware
const compression = require('compression') // Third-party middleware
const indexRouter = require('./routes/index.js');
const topicRouter = require('./routes/topic.js');

app.use(express.static('public')) // pyblic 디렉토리 안에서 static을 찾겠다
app.use(bodyParser.urlencoded({extended: false}))
app.use(compression())
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