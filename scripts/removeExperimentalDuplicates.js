const fs = require('fs');

process.argv.shift();
process.argv.shift();

const filename = process.argv[0];
const keyword = 'pragma experimental ABIEncoderV2;';

const oldFile = fs.readFileSync(filename).toString().split("\n");
const newFile = [];

let found = false;

for (i in oldFile) {
    if (oldFile[i] !== keyword) {
        newFile.push(oldFile[i]);
    } else if (found === false) {
        newFile.push(oldFile[i]);
        found = true;
    }
}

fs.writeFileSync(filename, newFile.join('\n'));