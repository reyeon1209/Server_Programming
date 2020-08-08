/*
function a() {
    console.log('A');
}
*/

var a = function() {    // 익명 함수 : 이름이 없는 함수
    console.log('A');
}   // JavaScript에서는 함수가 값이다.

// a();    // a라는 변수가 담고 있는 값인 함수를 실행

function slowfunc(callback) {
    callback();
}

slowfunc(a);