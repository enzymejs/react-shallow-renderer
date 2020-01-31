'use strict';

const fs = require('fs-extra');

// Makes the script crash on unhandled rejections instead of silently
// ignoring them. In the future, promise rejections that are not handled will
// terminate the Node.js process with a non-zero exit code.
// See https://github.com/facebook/create-react-app/blob/4582491/packages/react-scripts/scripts/build.js#L15-L20
process.on('unhandledRejection', err => {
  throw err;
});

async function copyFiles() {
  await Promise.all([
    fs.copy('LICENSE', 'build/LICENSE'),
    fs.copy('package.json', 'build/package.json'),
    fs.copy('README.md', 'build/README.md'),
    fs.copy('npm', 'build'),
  ]);
}

copyFiles();
