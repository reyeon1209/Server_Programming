var express = require('express')
var router = express.Router()

const template = require('../lib/template.js');

// get : routing, 사용자들이 여러 path를 통해서 들어올 때 path마다 적당한 응답을 해준다
router.get('/', (request, response) => {
    var title = 'Welcome';
    var description = 'Hello, Node.js';
    var list = template.list(request.list);
    var html = template.HTML(title,list,
      `
      <h2>${title}</h2>${description}
      <img src="/images/hello.jpg" style="width:300px; display:block; margin-top:10px;">
      `,
      `<a href="/topic/create">create</a>`
    );
  
    response.send(html);
  })

  module.exports = router;