var http = require('http');
var cookie = require('cookie');

http.createServer(function(request, response) {
    var cookies = {};
    if (request.headers.cookie !== undefined) {
        cookies = cookie.parse(request.headers.cookie);
    }
    console.log(cookies);
    response.writeHead(200, {
        'Set-Cookie': [
            'yummy_cookie=choco',
            'tasty_cookie=strawberry',
            `Permanent=cookies; Max-Age=${60*60*24*30}`,
            // Expires : 쿠키가 언제 만료될 것인가(절대적), Max-Age : 쿠키가 얼마나 유지될 것인가 (상대적)
            'Secure=Secure; Secure',    // ; 뒤가 중요
            'HttpOnly=HttpOnly; HttpOnly',   // ; 뒤가 중요
            'Path=Path; Path=/cookie',
            'Domain=Domain; Domain=o2.org'
        ]
    })
    response.end('Cookie!!');
}).listen(3000);