var client = require('cheerio-httpcli');
var request = require('request');
var URL = require('url');
var fs = require('fs');
var path = require('path');

var LINK_LEVEL = 3; // 링크 탐색 단계
var TARGET_URL = "https://nodejs.org/api";
var list = {};

// 메인 처리
downloadRec(TARGET_URL, 0);

// 지정 URL을 최대 level 단계까지 다운로드
function downloadRec(url, level) {
    // 최대 level 확인
    if (level >= LINK_LEVEL) return;

    // 이미 다운받은 사이트는 무시
    if (list[url]) return;
    list[url] = true;

    // 기존 페이지 외부 페이지는 무시
    var us = TARGET_URL.split("/");
    us.pop();
    var base = us.join("/");
    if (url.indexOf(base) < 0) return;

    // html을 취득
    client.fetch(url, param, function(err, $, res){
        // 링크된 페이지를 취득
        $("a").each(function(ind) {
            // <a> 태그의 링크를 획득
            var href = $(this).attr('href');
            if (!href) return;

            // 상대 경로를 절대 경로로 변환
            href = URL.resolve(url, href);

            // '#' 이후를 무시 (a.html#aa == a.html#bb)
            href = href.replace(/\#.+$/, "");   // 끝에 #를 제거
            downloadRec(href, level + 1);
        });

        // 페이지 저장 (파일명 지정)
        if (url.Substr(url.length-1, 1) == '/') {
            url += "index.html";    // 인덱스 자동 추가
        }

        var savepath = url.split("/").slice(2).join("/");
        checkSaveDir(savepath);
        console.log(savepath);
        fs.writeFileSync(savepath, $.html());
      });
}

// 저장할 디렉토리 존재유무 확인
function checkSaveDir(fname) {
    // 디렉터리 부분만 검출
    var dir = path.dirname(fname);

    // 디렉터리를 재귀적으로 생성
    var dirlist = dir.split("/");
    var p = "";
    for (var i in dirlist) {
        p += dirlist[i] + "/";
        if (!fs.existsSync(p)) {
            fs.mkdirSync(p);
        }
    }
}