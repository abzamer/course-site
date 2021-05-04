const fs = require("fs");
const path = require("path");

const walk = require('walk');
let walker;
const options = {
  followLinks: false
  // directories with these keys will be skipped
  , filters: ["Temp", "_Temp"]
};
const rootDir = `C:\\Users\\angel\\Documents\\CD Content Arabic`;
const htmlFile = 'myhrefs.html';
const lineBreaksHtml = `<br/><br/>`;

console.log(`Our directory: ${rootDir}`);
let fileCount = 0, dirCount = 0;
let fileList = [];
walker = walk.walk(rootDir, options);

walker.on("file", function (root, fileStats, next) {
  fs.readFile(fileStats.name, function () {
    // console.log(`Encountered file ${fileStats.name}, root:'${JSON.stringify(root)}'`);
    if (fileStats.name.toLowerCase().endsWith("jpg")) {
      // if the file ends with 'jpq', 'aif', 'wav', etc
      fileList.push(`${root}\\${fileStats.name}`);
      ++fileCount;

      // output the html for this file within the page html we want
      const localPath = root.replace(rootDir, '.').replace('\\', '/');
      const fileHrefToAdd = `<a href="./${fileStats.name}" id="section">${fileStats.name}</a>${lineBreaksHtml}`;

      let htmlFilePath = root.replace(rootDir, '.').concat(`/myhrefs.html`);
      fs.appendFileSync(htmlFilePath, fileHrefToAdd + "\n");

      // copy the file from the src (root) to dest localPath
      const src = `${root}\\${fileStats.name}`;
      const dest = `${localPath}\\${fileStats.name}`;
      // console.log(`About to copy ${src} => ${dest}`);
      fs.copyFileSync(src, dest);
    }
    // doStuff
    next();
  });
});

walker.on("directory", function (root, fileStats, next) {
  fs.readFile(fileStats.name, function () {
    // console.log(`Encountered dir ${fileStats.name}, root:'${JSON.stringify(root)}'`);

    // create directory
    const localPath = root.replace(rootDir, '.');
    const dirPathToCreate = `${localPath}\\${fileStats.name}`;
    fs.mkdir(dirPathToCreate, (error) => {
      if (error) {
        console.log(`Got an error:${error}`);
      }
    });
    // console.log(`Created dir ${dirPathToCreate}`);
    ++dirCount;

    // make sure we add a link in the current dir for this new directory we just added in the current dir's myhrefs.html
    // const htmlFile = 'myhrefs.html';
    // const localPath = root.replace(rootDir, '.').replace('\\', '/');
    // const fileHrefToAdd = `<a href="${localPath}/${fileStats.name}/${htmlFile}" id="section">${fileStats.name}</a>${lineBreaksHtml}`;
    const fileHrefToAdd = `<a href="./${fileStats.name}/${htmlFile}" id="section">${fileStats.name}</a>${lineBreaksHtml}`;
    let htmlFilePath = root.replace(rootDir, '.').concat(`/${htmlFile}`);
    fs.appendFileSync(htmlFilePath, fileHrefToAdd + "\n");

    next();
  });
});

walker.on("end", function (root, fileStats, next) {
  // console.log(`Reached the end, fileCount: ${fileCount}, fileList: ${JSON.stringify(fileList)}`);
  console.log(`Reached the end, fileCount: ${fileCount}, dirCount:${dirCount}`);
});
