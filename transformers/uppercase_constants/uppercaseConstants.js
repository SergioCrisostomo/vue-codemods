// https://astexplorer.net/#/gist/2518b989d1a8f33e61b9b95392355233/d1ba024f1c63e736f392e4d3a07f425fa18d9fce
const fs = require('fs');
const commandParser = require('../../utils/commandParser');
const jscodeshift = require('jscodeshift');
const getFiles = require('../../utils/getFiles');
const SCRIPT_CONTENT = /<script>[\s\S]+<\/script>/;

const {path: appRoot, fileTypes = ['.js', '.vue'], debug = false} = commandParser(process.argv);

const transform = (file, api) => {
  const j = api.jscodeshift;
  const jSource = j(file.source);

  const upperSnakeCase = (string) => {
    return string
      .replace(/([A-Z])/g, ' $1')
      .replace(/[\-_]/g, ' ')
      .split(' ')
      .map((word) => word.trim().toUpperCase())
      .filter(Boolean)
      .join('_');
  };

  const nodes = [];
  const opts = {which: 'all', dry: true};
  // "opts" can be: global, multiple, all
  // "dry" can be: true or undefined (dry will replace string appearances with the variable name)

  const constVariables = jSource
    .find(j.VariableDeclarator, {
      init: {
        type: 'Literal',
      },
    })
    .filter((node) => node.parent.node.kind === 'const')
    .filter((node) => {
      if (opts.which === 'global') {
        return node.isGlobal;
      }
      return true;
    });

  console.log('variables', constVariables.length);
  constVariables.forEach((node) => {
    const variableName = node.value.id.name;
    // usages will include both the declarations and the places where its used
    const usages = jSource.find(j.Identifier, {
      name: variableName,
    });

    if (opts.which === 'multiple' && usages < 3) {
      // in this case we have only the declaration and 1 usage of the variable
      return;
    }

    if (opts.dry) {
      const declaredString = node.value.init.value;
      const dryable = jSource.find(j.Literal, {value: declaredString}).forEach((string) => {
        if (string.parent === node) return;
        string.replace(upperSnakeCase(variableName));
      });
    }

    usages.forEach((Identifier, i, identifiers) => {
      let parent = Identifier.parent;

      while (parent) {
        // find the VariableDeclarator in the tree
        const declaratorParent = j(parent).find(j.VariableDeclarator, {
          init: {
            type: 'Literal',
          },
          id: {name: variableName},
        });

        // console.log(parent === node, declaratorParent.paths().length, parent.value.type);
        if (declaratorParent.paths().length > 1) {
          nodes.push(Identifier);
          return;
        }

        parent = parent.parentPath;
      }
    });
  });

  nodes
    .filter((el, i, arr) => arr.indexOf(el) === i)
    .forEach((node) => {
      const type = node.value.type;
      node.value.name = upperSnakeCase(node.value.name);
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
