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
    console.log(req.session);
    if (req.session.num === undefined) {
        req.session.num = 1;
    } else {
        req.session.num += 1;
    }
    res.send(`Views : ${req.session.num}`)
})
 
app.listen(3000, function(){
    console.log('3000!');
});