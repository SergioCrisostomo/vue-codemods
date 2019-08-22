const upperSnakeCase = (string) => {
  return string
    .replace(/([A-Z])/g, ' $1')
    .replace(/[\-_]/g, ' ')
    .split(' ')
    .map((word) => word.trim().toUpperCase())
    .filter(Boolean)
    .join('_');
};

module.exports = (file, api, options) => {
  const j = api.jscodeshift;
  const jSource = j(file.source);

  const removeDuplicates = (el, i, arr) => arr.indexOf(el) === i;

  const nodes = [];
  const opts = Object.assign({dry: false, which: 'multiple'}, JSON.parse(options || '{}'));

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

    let dryed = [];
    if (opts.dry) {
      const declaredString = node.value.init.value;
      jSource.find(j.Literal, {value: declaredString, regex: node.value.init.regex}).forEach((string) => {
        if (string.parent === node) return;
        dryed.push(node);
        string.replace(upperSnakeCase(variableName));
      });
      dryed = dryed.filter(removeDuplicates);
    }

    usages.forEach((Identifier) => {
      let parent = Identifier.parent;

      while (parent) {
        // find the VariableDeclarator in the tree
        const declaratorParent = j(parent).find(j.VariableDeclarator, {
          init: {
            type: 'Literal',
          },
          id: {name: variableName},
        });

        const matches = declaratorParent
          .paths()
          .concat(dryed)
          .filter(removeDuplicates);

        if (opts.which === 'all' || matches.length > 1 - dryed.length) {
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
      node.value.name = upperSnakeCase(node.value.name);
    });
  return jSource.toSource();
};
