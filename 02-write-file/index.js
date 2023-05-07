const { stdout, stdin } = process;
const fs = require('fs');
const path = require('path');

const file = fs.createWriteStream(path.join(__dirname, 'text.txt'));

stdout.write('Hi! Enter your text\n');
stdin.on('data', (text) => {
  if (text.toString().trim() === 'exit') {
    process.exit();
  }

  file.write(text);
});

const onExit = () => stdout.write('Writable stream is closed. Goodbye!');

process.on('SIGINT', process.exit);
process.on('exit', onExit);