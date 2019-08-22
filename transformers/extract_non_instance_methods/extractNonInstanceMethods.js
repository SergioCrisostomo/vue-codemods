// https://astexplorer.net/#/gist/1bb1149e9fd9a423ddcf255466ed5b40/2531ec207bb5f14b5f522c1f17549f18de4c623b
const fs = require('fs');
const jscodeshift = require('jscodeshift');
const vueCompiler = require('vue-template-compiler');
const getFiles = require('../../utils/getFiles');
const commandParser = require('../../utils/commandParser');
const transform = require('./transformer');

const HTML_CONTENT = /<template>[\s\S]+<\/template>/;
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
  let jsSource = fileContent;
  let templateSource = '';

  if (isVueFile) {
    const scriptContentMatch = fileContent.match(SCRIPT_CONTENT);
const templateContentMatch = fileContent.match(HTML_CONTENT);

    if (!scriptContentMatch || !templateContentMatch) {
      return;
    }

    jsSource = scriptContentMatch[0].slice('<script>'.length, -'</script>'.length);
    templateSource = templateContentMatch[0].slice('<template>'.length, -'</template>'.length);
  }

  if (debug) {
    console.log('::: SOURCE :::');
    console.log(jsSource);
  }


  const templateAST = vueCompiler.compile(templateSource).ast;
  let transformed = transform({source: jsSource}, {jscodeshift}, {templateAST});

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
