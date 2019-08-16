const fs = require('fs');
const nodePath = require('path');

function getFiles(dir, fileType, files_) {
  const regex = fileType ? new RegExp(`\\${fileType}$`) : '';

  return fs.readdirSync(dir).reduce((allFiles, file) => {
    const name = nodePath.join(dir, file);

    if (fs.statSync(name).isDirectory()) {
      getFiles(name, fileType, allFiles);
    } else if (file.match(regex)) {
      allFiles.push(name);
    }

    return allFiles;
  }, files_ || []);
}

module.exports = (path, type) =>
  new Promise((resolve) => {
    resolve(getFiles(path, type));
  });
