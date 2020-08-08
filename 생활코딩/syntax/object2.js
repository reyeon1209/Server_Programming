var f = function() {    // 처리 방법을 담고 있는 구문이면서 자체가 값이 될 수 있다.
    console.log(1+1);
    console.log(1+2);
}

var a = [f];
a[0]();

var o = {
    func : f
}
o.func();