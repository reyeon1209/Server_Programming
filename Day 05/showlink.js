var client = require('cheerio-httpcli');
var urlType = require('url');

// 다운로드
var url = "http://jpub.tistory.com";
var param = {};

client.fetch(url, param, function (err, $, res) {
    // 에러 체크
    if (err) { console.log("error"); return; }

    // 링크를 추출하여 표시
    $("a").each(function(ind) {
        var text = $(this).text();
        var href = $(this).attr('href');
        if (!href) return;

        // 상대경로를 절대경로로 변환
        var href2 = urlType.resolve(url, href);

        // 결과물 표시
        console.log(text + " : " + href);
        console.log("  => " + href2 + "\n");
    });
});