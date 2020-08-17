var express = require('express')
var parseurl = require('parseurl')
var session = require('express-session')
  
var app = express()
  
app.use(session({
  secret: 'keyboard cat',   // 별도의 파일로 분리 후 버전 관리
  resave: false,
  saveUninitialized: true
}))
  
app.get('/', function (req, res, next) {
  res.send('Hello Session')
})
 
app.listen(3000, function(){
    console.log('3000!');
});