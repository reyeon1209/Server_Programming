module.exports = {
  HTML:function(title, list, body, control){
    return `
    <!doctype html>
    <html>
    <head>
      <title>WEB1 - ${title}</title>
      <meta charset="utf-8">
    </head>
    <body>
      <h1><a href="/">WEB</a></h1>
      <a href="/author">author</a>
      ${list}
      ${control}
      ${body}
    </body>
    </html>
    `;
  },
  
  list:function(results){
    var list = '<ul>';
    var i = 0;
    while(i < results.length){
      list = list + `<li><a href="/?id=${results[i].id}">${results[i].title}</a></li>`;
      i = i + 1;
    }
    list = list+'</ul>';
    return list;
  },
  
  authorSelect : function(authors, author_id) {
    var tag = '';
    var i = 0;

    while (i < authors.length) {
      var selected = ';'
      if (authors[i].id === author_id) {
        selected = ' selected';
      }
      tag += `<option value="${authors[i].id}"${selected}>${authors[i].name}</option>`
      i++;
    }

    return `
    <select name="author">
      ${tag}
    </select>
    `;
  },
  
  authorTable : function(authors) {
    var tag = '<table>';
    var i = 0;

    while (i < authors.length) {
      tag += `
        <tr>
            <td>${authors[i].name}</td>
            <td>${authors[i].profile}</td>
            <td><a href="/author/update?id=${authors[i].id}">update</a></td>
            <td>delete</td>
        </tr>
      `
      i++;
    }
    tag += '</table>';

    return tag;
  }
}
