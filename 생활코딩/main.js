var http = require('http');
var fs = require('fs');
var url = require('url');

function templateHTML(title, list, body) {
    return `
    <!doctype html>
    <html>
    <head>
    <title>WEB1 - ${title}</title>
    <meta charset="utf-8">
    </head>
    <body>
    <h1><a href="/">WEB</a></h1>
    ${list}
    ${body}
    </body>
    </html>
    `;
}

function templateList(filelist) {
    var list = '<ul>';
    filelist.forEach(element => list += `<li><a href="/?id=${element}">${element}</a></li>`);
    list += '</ul>';

    return list;
}
 
var app = http.createServer(function(request,response) {
    var _url = request.url;
    var queryData = url.parse(_url, true).query;
    var pathname = url.parse(_url, true).pathname;

    if (pathname === '/') {
      if (queryData.id === undefined) {
          fs.readdir('./data', (error, filelist) => {
            var title = 'Welcome';
            var description = 'Hello, Node.js';
            var list = templateList(filelist);
            var template = templateHTML(title, list, `<h2>${title}</h2>${description}`);

            response.writeHead(200);  // 200 : 파일을 성공적으로 전송
            response.end(template);
          });
      } else {
        fs.readdir('./data', (error, filelist) => {
            fs.readFile(`data/${queryData.id}`, 'utf8', (err, description) =>  {
            var title = queryData.id;
            var list = templateList(filelist);
            var template = templateHTML(title, list, `<h2>${title}</h2>${description}`);

            response.writeHead(200);  // 200 : 파일을 성공적으로 전송
            response.end(template);
            });
        });
      }
    } else {
      response.writeHead(404);  // 404 : 파일을 찾을 수 없음
      response.end('Not found');
    }
});

app.listen(3000);   // localhost:3000

/*
http://opentutorials.org:3000/main?id=HTML&page=12

http : protocol
opentutorials.org : host(domain)
3000 : port (기본이 80이라 80인 경우 port번호 생략 가능)
main : path
id=HTML&page=12 : query string (시작은 ?, 값과 값은 &)
*/