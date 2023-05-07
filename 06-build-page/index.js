const fs = require('fs');
const path = require('path');

const template = path.join(__dirname, 'template.html');
const components = path.join(__dirname, 'components');
const inputAssets = path.join(__dirname, 'assets');
const outputFolder = path.join(__dirname, 'project-dist');
const outputAssets = path.join(outputFolder, 'assets');
const inputStyles = path.join(__dirname, 'styles');
const outputStyle = path.join(outputFolder, 'style.css');

const getFilesInfo = async (folder) => {
  const files = await fs.promises.readdir(folder, {withFileTypes: true});
  return files;
};

const deleteFolder = async (folder) => {
  try {
    await fs.promises.rm(folder, { recursive: true });
  } catch (e) {
    // throw new Error(e);
    console.log('');
  }
};

const createFolder = async (folder) => {
  await fs.promises.mkdir(folder, { recursive: true });
};

const copyDir = async (input, output) => {
  try {
    await createFolder(output);
    const folderData = await getFilesInfo(input);
    await copyFiles(folderData, input, output);
  } catch (e) {
    throw new Error(e);
  }
};

const copyFiles = async (files, fromFolder, toFolder) => {
  for (let file of files) {
    const fromFolderFile = path.join(fromFolder, file.name);
    const toFolderFile = path.join(toFolder, file.name);
    if (file.isFile()) {
      await fs.promises.copyFile(fromFolderFile, toFolderFile);
    } else {
      await copyDir(fromFolderFile, toFolderFile);
    }
  }
};

const buildStyles = async (input, output) => {
  const outputFile = fs.createWriteStream(output);
  const files = await getFilesInfo(input);
  for (const file of files) {
    if (file.isFile() && path.extname(file.name) === '.css') {
      const inputFile = path.join(input, file.name);
      fs.createReadStream(inputFile, 'utf-8').pipe(outputFile);
    }
  }
};

const buildTemplate = async (template, outputFolder) => {
  let templateHTML = await fs.promises.readFile(template, 'utf8');
  const tags = templateHTML.matchAll(/{{(.*?)}}/g);

  for (let tag of tags) {
    const componentName = tag[1];
    let componentFile = path.join(components, `${componentName}.html`);
    const componentHTML = await fs.promises.readFile(componentFile, 'utf8');

    templateHTML = templateHTML.replace(tag[0], componentHTML);
  }

  await fs.promises.writeFile(
    path.join(outputFolder, 'index.html'),
    templateHTML,
    'utf-8'
  );
};

const main = async () => {
  await deleteFolder(outputFolder);
  await createFolder(outputFolder);
  await buildStyles(inputStyles, outputStyle);
  await copyDir(inputAssets, outputAssets);
  await buildTemplate(template, outputFolder);
};

main();