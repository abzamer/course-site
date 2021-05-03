const fs = require("fs");
const path = require("path");

// async function* walk(dir) {
//     for await (const d of await fs.promises.opendir(dir)) {
//         const entry = path.join(dir, d.name);
//         if (d.isDirectory()) yield* walk(entry);
//         else if (d.isFile()) yield entry;
//     }
// }

// // Then, use it with a simple async for loop
// async function main() {
//     console.log('Starting main');
//     for await (const p of walk('C:\Users\angel\Documents\CD Content Arabic'))
//         console.log(p)
//     console.log('All done!');
// }
// C:\Users\angel\Documents\CD Content Arabic

const walk = require('walk');
let walker;
const options = {
    followLinks: false
    // directories with these keys will be skipped
  , filters: ["Temp", "_Temp"]
  };
  const rootDir = `C:\\Users\\angel\\Documents\\CD Content Arabic`;
  console.log(`Our directory: ${rootDir}`);
  let fileCount = 0;
  let fileList = [];
  walker = walk.walk(rootDir, options);

 
  walker.on("file", function (root, fileStats, next) {
    fs.readFile(fileStats.name, function () {
        console.log(`Encountered file ${fileStats.name}, root:'${JSON.stringify(root)}'`);
        if(fileStats.name.toLocaleLowerCase().endsWith("jpg")) {
            // if the file ends with 'jpq', 'aif', 'wav', etc
            fileList.push(`${root}\\${fileStats.name}`);
            ++fileCount;

            // output the html for this file within the page html we want
            // <a href="assets/images/sigmund-IKXHeZw2XoY-unsplash.jpg" id="section">Class 2</a>
            const localPath = root.replace(rootDir,'.').replace('\\','/');
            const fileHrefToAdd = `<a href="${localPath}/${fileStats.name}" id="section">${fileStats.name}</a>`;
            let htmlFilePath = root.replace(rootDir,'.').concat(`/myhrefs.html`);
            fs.appendFileSync(htmlFilePath, fileHrefToAdd + "\n");
        }
      // doStuff
      next();
    });
  });

  walker.on("directory", function (root, fileStats, next) {
    fs.readFile(fileStats.name, function () {
        console.log(`Encountered dir ${fileStats.name}, root:'${JSON.stringify(root)}'`);
        const localPath = root.replace(rootDir,'.');
        const dirPathToCreate = `${localPath}\\${fileStats.name}`;
        fs.mkdir(dirPathToCreate, (error) => {
          if(error) {
            console.log(`Got an error:${error}`);
          }
        } );
        console.log(`Created dir ${dirPathToCreate}`);
      next();
    });
  });

  walker.on("end", function (root, fileStats, next) {
        console.log(`Reached the end, fileCount: ${fileCount}, fileList: ${JSON.stringify(fileList)}`);
  });