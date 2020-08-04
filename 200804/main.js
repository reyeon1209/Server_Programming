var http = require('http');
var fs = require('fs');
var url = require('url');

var app = http.createServer(function(request,response) {
    var _url = request.url;
    var queryData = url.parse(_url, true).query;
    var title = queryData.id;
    console.log('queryData_id : ' + queryData.id);
    if (_url == '/') {
      title = 'Welcome!';
    }
    if (_url == '/favicon.ico') {
        response.writeHead(404);
        response.end();
        return;
    }
    response.writeHead(200);
    fs.readFile(`data/${queryData.id}`, 'utf8', (err, description) => {
        if (err) throw err;
        var template = `
        <!doctype html>
        <html>
        <head>
        <title>WEB1 - ${title}</title>
        <meta charset="utf-8">
        </head>
        <body>
        <h1><a href="/">WEB</a></h1>
        <ol>
            <li><a href="/?id=HTML">HTML</a></li>
            <li><a href="/?id=CSS">CSS</a></li>
            <li><a href="/?id=JavaScript">JavaScript</a></li>
        </ol>
        <h2>${title}</h2>
        <p>${description}</p>
        </body>
        </html>
        `;
        response.end(template);
    });
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