// https://astexplorer.net/#/gist/1bb1149e9fd9a423ddcf255466ed5b40/2531ec207bb5f14b5f522c1f17549f18de4c623b
const fs = require('fs');
const commandParser = require('../../utils/commandParser');
const jscodeshift = require('jscodeshift');
const getFiles = require('../../utils/getFiles');
const SCRIPT_CONTENT = /<script>[\s\S]+<\/script>/;

const {path: appRoot, fileTypes = ['.js', '.vue'], debug = false, options} = commandParser(process.argv);

const transform = (file, api) => {
  const j = api.jscodeshift;

  const getClosest = (node, type) => {
    const closest = j(node).closest(type);

    if (closest.length > 0) {
      return closest.get();
    }
    return null;
  };

  const jSource = j(file.source);
  const methodsObject = jSource
    .find(j.Identifier, {name: 'methods'})
    .map((node) => {
      let depth = 0;
      let parentObject = node;

      while ((parentObject = getClosest(parentObject, j.ObjectExpression))) {
        depth++;

        if (depth === 2) {
          return parentObject;
        }
      }
    })
    .filter(Boolean)
    .get();
  console.log('methodsObject', methodsObject);
  const methodFunctions = methodsObject.value.properties;
  const methodsWithNoThis = methodFunctions.filter((fn) => {
    const thisExpressions = j(fn).find(j.ThisExpression);
    return thisExpressions.length === 0;
  });

  // remove methods from the instance
  methodsObject.value.properties = methodsObject.value.properties.filter((prop) => {
    return !methodsWithNoThis.includes(prop);
  });
  // add the method as a variable in the body
  const vueRoot = ((node) => {
    let root = node;
    while ((node = getClosest(node, j.ObjectExpression))) {
      root = node;
    }
    return root;
  })(methodsObject);

  const rootDeclaration = getClosest(vueRoot, j.VariableDeclaration) || getClosest(vueRoot, j.ExportDefaultDeclaration);

  const body = jSource.find(j.Program).get().value.body;
  const indexOfRootVariableDeclaration = body.indexOf(rootDeclaration.value);

  methodsWithNoThis.forEach((method) => {
    const name = method.key.name;
    const variableDeclaration = j.variableDeclaration('const', [j.variableDeclarator(j.identifier(name), method.value)]);
    body.splice(indexOfRootVariableDeclaration, 0, variableDeclaration);

    // correct the path inside the instance
    const usages = j(methodsObject).find(j.MemberExpression, {
      object: {type: 'ThisExpression'},
      property: {name: name},
    });
    usages.forEach((entry) => j(entry).replaceWith(name));

    // correct the path inside the template
    // TODO
  });

  return jSource.toSource();
};

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

  let transformed = transform({source}, {jscodeshift});

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
