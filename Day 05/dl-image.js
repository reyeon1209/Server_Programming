var client = require('cheerio-httpcli');
var request = require('request');
var URL = require('url');
var fs = require('fs');

// 저장할 디렉토리가 없으면 생성
var savedir = __dirname + "/img";
if (!fs.existsSync(savedir)) {
    fs.mkdirSync(savedir);
}

// URL지정
var url = "http://ko.wikipedia.org/wiki/" + encodeURIComponent("강아지");
var param = {};

// html파일 획득
client.fetch(url, param, function(err, $, res){
    // 에러 체크
    if (err) { console.log("error"); return; }

    // 링크를 추출해 각 링크에 대해 함수 실행
    $("img").each(function(ind) {
        var src = $(this).attr("src");

        // 상대 경로를 절대 경로로 변환
        src = URL.resolve(url, src);

        // 저장 파일 이름 결정
        var fname = URL.parse(src).pathname;
        fname = savedir + "/" + fname.replace(/[^a-zA-Z0-9\.]+/g, '_');

        // 다운로드
        request(src).pipe(fs.createWriteStream(fname));
    });
});