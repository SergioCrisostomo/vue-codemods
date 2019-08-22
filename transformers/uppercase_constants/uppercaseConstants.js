// https://astexplorer.net/#/gist/2518b989d1a8f33e61b9b95392355233/35a00f3cf2f0be9191ccfc42a9b81998c2159b46
const fs = require('fs');
const commandParser = require('../../utils/commandParser');
const jscodeshift = require('jscodeshift');
const getFiles = require('../../utils/getFiles');
const transform = require('./transformer');
const SCRIPT_CONTENT = /<script>[\s\S]+<\/script>/;

const {path: appRoot, fileTypes = ['.js', '.vue'], debug = false, options} = commandParser(process.argv);


function processFile(file) {
  console.log('File:', file);
  const shouldIgnore = false; // ignoredFiles.find((ignoredPath) => file.includes(ignoredPath));

  if (shouldIgnore) {
    return;
  }

  console.log('Processing:', file);
  const isVueFile = Boolean(file.match(/.vue$/));

  const fileContent = fs.readFileSync(file, 'utf8');
  let source = fileContent;

  if (isVueFile) {
    const match = fileContent.match(SCRIPT_CONTENT);

    if (!match) {
      return;
    }

    source = match[0].slice('<script>'.length, -'</script>'.length);
  }

  if (debug) {
    console.log('::: SOURCE :::');
    console.log(source);
  }

  let transformed = transform({source}, {jscodeshift}, options);

  if (debug) {
    console.log('::: JSCODESHIFT :::');
    console.log(transformed);
  }

  const newContent = isVueFile ? fileContent.replace(SCRIPT_CONTENT, `<script>${transformed}</script>`) : transformed;

  if (debug) {
    console.log('Transformed content', newContent);
  } else {
    fs.writeFileSync(file, newContent);
  }
}

const isSingleFile = Boolean(appRoot.match(/\.js$|\.vue$/));
fileTypes
  .filter((type) => {
    if (!isSingleFile) return true;
    return appRoot.match(new RegExp(type + '$'));
  })
  .forEach((type) => {
    const filePaths = isSingleFile ? Promise.resolve([appRoot]) : getFiles(appRoot, type);

    filePaths
      .then((files) => {
        const sourceFiles = files.filter((filePath) => !filePath.includes('node_modules') && !filePath.includes('sandbox'));
        console.log('Found', sourceFiles.length, 'files of type:', type);
        sourceFiles.forEach(processFile);

        return sourceFiles;
      })
      .catch((err) => console.log(err));
  });
