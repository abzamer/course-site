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
        // console.log(`Encountered file ${fileStats.name}, root:'${JSON.stringify(root)}'`);
        if(fileStats.name.toLocaleLowerCase().endsWith("jpg")) {
            // if the file ends with 'jpq', 'aif', 'wav', etc
            fileList.push(`${root}\\${fileStats.name}`);
            ++fileCount;
        }
      // doStuff
      next();
    });
  });

  walker.on("directory", function (root, fileStats, next) {
    fs.readFile(fileStats.name, function () {
        console.log(`Encountered dir ${fileStats.name}, root:'${JSON.stringify(root)}'`);
      next();
    });
  });

  walker.on("end", function (root, fileStats, next) {
        console.log(`Reached the end, fileCount: ${fileCount}, fileList: ${JSON.stringify(fileList)}`);
  });