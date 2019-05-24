const fs = require('fs');

const filename = process.argv[2];
const keyword = 'pragma experimental ABIEncoderV2;';

const oldFile = fs.readFileSync(filename).toString().split("\n");
const newFile = [];

let found = false;

for (line in oldFile) {
    if (oldFile[line] !== keyword) {
        newFile.push(oldFile[line]);
    } else if (found === false) {
        newFile.push(oldFile[line]);
        found = true;
    }
}

fs.writeFileSync(filename, newFile.join('\n'));