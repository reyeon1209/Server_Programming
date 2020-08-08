var testFolder = './data';
var fs = require('fs');

fs.readdir(testFolder, (error, filelist) => {
  console.log(filelist);
});