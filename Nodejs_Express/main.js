const express = require('express')
const app = express()
const port = 3000

const fs = require('fs');
const bodyParser = require('body-parser')
const template = require('./lib/template.js');
const path = require('path');
const sanitizeHtml = require('sanitize-html');
const compression = require('compression')

app.use(bodyParser.urlencoded({ extended: false }))
app.use(compression())
app.get('*', function(request, response, next) { 
  // 'get'방식으로 들어오는 '*'모든 요청에 대해서 파일 목록을 가져오는 middleware
  fs.readdir('./data', function(error, filelist){
    request.list = filelist;
    next();
  });
})

// get : routing, 사용자들이 여러 path를 통해서 들어올 때 path마다 적당한 응답을 해준다
app.get('/', (request, response) => {
  var title = 'Welcome';
  var description = 'Hello, Node.js';
  var list = template.list(request.list);
  var html = template.HTML(title, list,
    `<h2>${title}</h2>${description}`,
    `<a href="/create">create</a>`
  );

  response.send(html);
})

app.get('/page/:pageId', (request, response) => {
  var filteredId = path.parse(request.params.pageId).base;
  fs.readFile(`data/${filteredId}`, 'utf8', function(err, description){
    var title = request.params.pageId;
    var sanitizedTitle = sanitizeHtml(title);
    var sanitizedDescription = sanitizeHtml(description, {
      allowedTags:['h1']
    });
    var list = template.list(request.list);
    var html = template.HTML(sanitizedTitle, list,
      `<h2>${sanitizedTitle}</h2>${sanitizedDescription}`,
      ` <a href="/create">create</a>
        <a href="/update/${sanitizedTitle}">update</a>
        <form action="/delete_process" method="post">
          <input type="hidden" name="id" value="${sanitizedTitle}">
          <input type="submit" value="delete">
        </form>`
  );
  
  response.send(html);
})

app.get('/create', (request, response) => {
    var title = 'WEB - create';
    var list = template.list(request.list);
    var html = template.HTML(title, list, `
      <form action="/create_process" method="post">
        <p><input type="text" name="title" placeholder="title"></p>
        <p>
          <textarea name="description" placeholder="description"></textarea>
        </p>
        <p>
          <input type="submit">
        </p>
      </form>
    `, '');
    
    response.send(html);
  });
})

app.post('/create_process', function (request, response) {
  var post = request.body;
  var title = post.title;
  var description = post.description;

  fs.writeFile(`data/${title}`, description, 'utf8', function(err){
    response.redirect(`/?id=${title}`);
  })
})

app.get('/update/:pageId', (request, response) => {
  var filteredId = path.parse(request.params.pageId).base;
  fs.readFile(`data/${filteredId}`, 'utf8', function(err, description){
    var title = request.params.pageId;
    var list = template.list(request.list);
    var html = template.HTML(title, list,
      `
      <form action="/update_process" method="post">
        <input type="hidden" name="id" value="${title}">
        <p><input type="text" name="title" placeholder="title" value="${title}"></p>
        <p>
          <textarea name="description" placeholder="description">${description}</textarea>
        </p>
        <p>
          <input type="submit">
        </p>
      </form>
      `,
      `<a href="/create">create</a> <a href="/update?id${title}">update</a>`
    );
    
    response.send(html);
  });
})

app.post('/update_process', function (request, response) {
  var post = request.body;
  var id = post.id;
  var title = post.title;
  var description = post.description;

  fs.rename(`data/${id}`, `data/${title}`, function(error){
    fs.writeFile(`data/${title}`, description, 'utf8', function(err){
      response.redirect(`/?id=${title}`);
    })
  });
})

app.post('/delete_process', function (request, response) {
  var post = request.body;
  var id = post.id;
  var filteredId = path.parse(id).base;

  fs.unlink(`data/${filteredId}`, function(error){
    response.redirect('/');
  })
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})