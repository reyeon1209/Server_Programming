var qs = require('querystring');
var template = require('./template.js');
var db = require('./db.js');

exports.home = function(request, response) {
    db.query(`SELECT * FROM topic`, function (error, topics) {
        if (error) {
            throw error;
        }

        db.query(`SELECT * FROM author`, function (error2, authors) {
            if (error2) {
                throw error2;
            }

            var title = 'authore';
            var list = template.list(topics);
            var html = template.HTML(title, list,
                `
                    ${template.authorTable(authors)}

                    <style>
                        table {
                            border-collapse : collapse;
                        }
                        td {
                            border : 1px solid black;
                        }
                    </style>

                    <form action="/author/create_process" method="post">
                        <p>
                            <input type="text" name="name", placeholder="name">
                        </p>
                        <p>
                            <textarea name="profile" placeholder="profile"></textarea>
                        </p>
                        <p>
                            <input type="submit">
                        </p>   
                    </form>
                `, ``);

            response.writeHead(200);
            response.end(html);
        });
    });
}

exports.create_process = function(request, response) {
    var body = '';

    request.on('data', function(data){
        body = body + data;
    });

    request.on('end', function(){
        var post = qs.parse(body);

        db.query(`INSERT INTO author (name, profile) VALUES(?, ?)`,
        [post.name, post.profile]
        , function (error, topic) {
            if (error) {
                throw error;
            }

            response.writeHead(302, {Location: `/author`});
            response.end();
        });
    });
}