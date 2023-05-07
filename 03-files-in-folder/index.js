const path = require('path');
const { readdir, stat } = require('fs/promises');
const { stdout } = process;

const folderDirectory = path.join(__dirname, 'secret-folder');

async function readDir (directory) {
  const files = await readdir(directory, { withFileTypes: true });
  for (const file of files) {
    if (file.isFile()) {
      const fileName = path.basename(file.name, path.extname(file.name));
      const fileExtension = path.extname(file.name).slice(1);
      const stats = await stat(path.join(directory, file.name));
      const fileSize = `${(stats.size / 1024).toFixed(3)}kb`;
      stdout.write(`${fileName} - ${fileExtension} - ${fileSize}\n`);
    }
  }
}

readDir(folderDirectory);