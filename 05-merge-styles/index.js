const fs = require('fs');
const path = require('path');
const { readdir } = require('fs/promises');

const inputFolderDirectory = path.join(__dirname, 'styles');
const outputFileDirectory = path.join(__dirname, 'project-dist', 'bundle.css');
const outputFile = fs.createWriteStream(outputFileDirectory);

async function readDir (directory) {
  const files = await readdir(directory, { withFileTypes: true });
  for (const file of files) {
    if (file.isFile() && path.extname(file.name) === '.css') {
      const inputFileDirectory = path.join(directory, file.name);
      fs.createReadStream(inputFileDirectory, 'utf-8').pipe(outputFile);
    }
  }
}

readDir(inputFolderDirectory);