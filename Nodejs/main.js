var http = require('http');
var fs = require('fs');
var url = require('url');
var qs = require('querystring');

var template = {
  HTML : function(title, list, body, control) {
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
    ${control}
    ${body}
    </body>
    </html>
    `;
  },

  list : function(filelist) {
    var list = '<ul>';
    filelist.forEach(element => list += `<li><a href="/?id=${element}">${element}</a></li>`);
    list += '</ul>';

    return list;
  }
}


var app = http.createServer(function(request,response) {  // request : 요청할 때 정보들, response : 응답할 때 정보들
    var _url = request.url;
    var queryData = url.parse(_url, true).query;
    var pathname = url.parse(_url, true).pathname;

    if (pathname === '/') {
      if (queryData.id === undefined) {
          fs.readdir('./data', (error, filelist) => {
            var title = 'Welcome';
            var description = 'Hello, Node.js';
            var list = template.list(filelist);
            var html = template.HTML(title, list, `<h2>${title}</h2>${description}`, `<a href="/create">create</a>`);

            response.writeHead(200);  // 200 : 파일을 성공적으로 전송
            response.end(html);
          });
      } else {
        fs.readdir('./data', (error, filelist) => {
            fs.readFile(`data/${queryData.id}`, 'utf8', (err, description) =>  {
            var title = queryData.id;
            var list = template.list(filelist);
            var html = template.HTML(title, list, `<h2>${title}</h2>${description}`,
            `
              <a href="/create">create</a>
              <a href="/update?id=${title}">update</a>
              <form action="delete_process" method="post">
                <input type="hidden" name="id" value="${title}">
                <input type="submit" value="delete">
              </form>
            `);

            response.writeHead(200);  // 200 : 파일을 성공적으로 전송
            response.end(html);
            });
        });
      }
    } else if (pathname === '/create') {
        fs.readdir('./data', (error, filelist) => {
          var title = 'WEB - create';
          var list = template.list(filelist);
          var html = template.HTML(title, list,
            `
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

          response.writeHead(200);  // 200 : 파일을 성공적으로 전송
          response.end(html);
        });
    } else if (pathname === '/create_process') {
      var body = '';
      request.on('data', function(data) {
        // post방식으로 전송할 때 data가 많을 경우 문제 발생 가능
        // 이를 대비해 일정량 수신할 때 마다(event) callback함수 호출하고 data인자를 통해 수신 정보를 줌
        body += data; // callback이 실행될 때마다 data 계속 추가
        if (body.length > 1e6) {
          request.connection.destroy(); // 너무 많을 경우 연결 끊음
        }
      });
      request.on('end', function() {  // 데이터가 더이상 없을 경우(event) callback함수 호출
        var post =  qs.parse(body); // parse() : 쿼리 문자열을 쿼리 객체로 바꿔줌
        var title = post.title;
        var description = post.description;
        fs.writeFile(`data/${title}`, description, 'utf8', (err) => {
          response.writeHead(302, {Location: `/?id=${title}`});  // 302 : 페이지를 다른 곳으로 redirection 시켜라
          response.end();
        });
      });
    } else if (pathname === '/update') {
      fs.readdir('./data', (error, filelist) => {
        fs.readFile(`data/${queryData.id}`, 'utf8', (err, description) =>  {
        var title = queryData.id;
        var list = template.list(filelist);
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
          `, `<a href="/create">create</a> <a href="/update?id=${title}">update</a>`);

        response.writeHead(200);  // 200 : 파일을 성공적으로 전송
        response.end(html);
        });
    });
  } else if (pathname === '/update_process') {
    var body = '';
    request.on('data', function(data) {
      body += data;
      if (body.length > 1e6) {
        request.connection.destroy(); // 너무 많을 경우 연결 끊음
      }
    });
    request.on('end', function() { 
      var post =  qs.parse(body); // parse() : 쿼리 문자열을 쿼리 객체로 바꿔줌
      var id = post.id;
      var title = post.title;
      var description = post.description;
      fs.rename(`data/${id}`, `data/${title}`, function(error) {
        fs.writeFile(`data/${title}`, description, 'utf8', (err) => {
          response.writeHead(302, {Location: `/?id=${title}`});  // 302 : 페이지를 다른 곳으로 redirection 시켜라
          response.end();
        });
      });
    });
  } else if (pathname === '/delete_process') {
    var body = '';
    request.on('data', function(data) {
      body = body + data;
      if (body.length > 1e6) {
        request.connection.destroy(); // 너무 많을 경우 연결 끊음
      }
    });
    request.on('end', function() {
      var post = qs.parse(body);
      var id = post.id;
      fs.unlink(`data/${id}`, function(error) {
        response.writeHead(302, {Location: `/`});
        response.end();
      })
  });
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