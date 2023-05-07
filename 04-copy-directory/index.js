const path = require('path');
const { rm, mkdir, readdir, copyFile } = require('fs/promises');

const fromFolder = path.join(__dirname, 'files');
const toFolder = path.join(__dirname, 'files-copy');

const copyDir = async (from, to) => {
  try {
    await deleteFolder(to);
  } catch {
    // do nothing
  } 
  finally {
    await createFolder(to);
    const files = await getFilesInfo(from);
    await copyFiles(files, from, to);
  }
};

const deleteFolder = async (folder) => {
  await rm(folder, { recursive: true });
};

const createFolder = async (folder) => {
  await mkdir(folder, { recursive: true });
};

const getFilesInfo = async (folder) => {
  const files = await readdir(folder, {withFileTypes: true});
  return files;
};

const copyFiles = async (files, fromFolder, toFolder) => {
  for (let file of files) {
    const fromFolderFile = path.join(fromFolder, file.name);
    const toFolderFile = path.join(toFolder, file.name);
    if (file.isFile()) {
      copyFile(fromFolderFile, toFolderFile);
    } else {
      await copyDir(fromFolderFile, toFolderFile);
    }
  }
};

copyDir(fromFolder, toFolder);
