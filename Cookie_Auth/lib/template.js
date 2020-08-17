module.exports  = {
    HTML : function(title, list, body, control, authStatusUI = '<a href="/login">login</a>') {
        return `
        <!doctype html>
        <html>
        <head>
            <title>WEB1 - ${title}</title>
            <meta charset="utf-8">
        </head>
        <body>
            ${authStatusUI}
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