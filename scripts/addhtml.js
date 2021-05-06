const fs = require("fs");
const path = require("path");

const walk = require('walk');
let walker;
const options = {
  followLinks: false
  // directories with these keys will be skipped
  , filters: ["Temp", "_Temp"]
};
const rootDir = '.'; //`C:\\Users\\angel\\Documents\\CD Content Arabic`;
const htmlFile = 'myhrefs.html';
const styleCSSFilePath = `C:\\Users\\angel\\Desktop\\Coding\\course-site\\assets\\css\\style.css`;

// for the second pass which will prepend and append the following to make a nice looking file
const prependingHtml = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <!--link rel="stylesheet" type="text/css" href="../assets/css/style.css"-->
    <link rel="stylesheet" type="text/css" href="./style.css">
    
    <title>course</title>
</head>
    
<body>
    <header id="masthead">
        <div class="container" id="logo">
            Arabic 
        </div>
    </header>
    
    <div id="main-container" class="container">
        <section class="main-section">
            <h1>Click on the appropriate button</h1>`;
const endingHtml = `        </section>
                    </div>
                    </body>
                    </html>`;

console.log(`Our directory: ${rootDir}`);
let fileCount = 0, dirCount = 0;
let fileList = [];
walker = walk.walk(rootDir, options);

walker.on("file", function (root, fileStats, next) {
  fs.readFile(fileStats.name, function () {
    // console.log(`Encountered file ${fileStats.name}, root:'${JSON.stringify(root)}'`);
    if (fileStats.name.toLowerCase() === htmlFile) {//fileStats.name.toLocaleLowerCase().endsWith("jpg")) {
      fileList.push(`${root}\\${fileStats.name}`);
      ++fileCount;

      console.log(`Found a myhrefs.html file! root:${root}`);
      const myhrefsHtmlToEdit = `${root}\\${fileStats.name}`;
      // prepend html to this file
      const data = fs.readFileSync(myhrefsHtmlToEdit)
      const fd = fs.openSync(myhrefsHtmlToEdit, 'w+')
      const insert = prependingHtml; // new Buffer("text to prepend \n")
      fs.writeSync(fd, insert, 0, insert.length, 0)
      fs.writeSync(fd, data, 0, data.length, insert.length)
      fs.close(fd, (err) => {
        if (err) throw err;
      });

      // append closing html to this file
      fs.appendFileSync(myhrefsHtmlToEdit, endingHtml);

      // also naively add a styles.css to every directory so it looks decent
      const src = styleCSSFilePath;
      const destDir =`${root}`;
      const dest = `${destDir}/style.css`;
      console.log(`About to copy ${src} => ${dest}, root:${root} exists src:${fs.existsSync(src)} 
          exists destdir:${fs.existsSync(destDir)}`);
      fs.copyFileSync(src, dest);
    }
    // doStuff
    next();
  });
});

walker.on("end", function (root, fileStats, next) {
  console.log(`Reached the end, myhrefhtml count: ${fileCount}`);
});
