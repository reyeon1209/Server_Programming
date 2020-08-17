var fs = require('fs');

/*
// readFileSync (동기)
console.log('A');
var result = fs.readFileSync('syntax/sample.txt', 'utf-8');
console.log(result);
console.log('C');
*/

// readFile (비동기)
console.log('A');
fs.readFile('syntax/sample.txt', 'utf-8', function(err, result) {   // callback
    console.log(result);
});
console.log('C');