const getAllAttrs = (node) => {
  if (!node) {
    return [];
  }
  if (node.hasOwnProperty('attrsList')) {
    return node.attrsList;
  } else if (Array.isArray(node)) {
    return node.filter(getAllAttrs);
  } else if (typeof node === 'object') {
    return Object.keys(node).filter(getAllAttrs);
  }
  return [];
};

const extractFlatAttrsList = (ast) => {
  const flatList = getAllAttrs(ast).reduce((arr, attrs) => arr.concat(attrs), []);
  return flatList.map(({value}) => {
    const [match] = value.split(/[^\w\-]/);
    return match;
  });
};

module.exports = (file, api, options) => {
  const j = api.jscodeshift;

  const getClosest = (node, type) => {
    const closest = j(node).closest(type);

    if (closest.length > 0) {
      return closest.get();
    }
    return null;
  };

  // check which attrs to not extract
  const templateAttrs = extractFlatAttrsList(options.templateAST);

  const jSource = j(file.source);

  const methodsIdentifier = jSource.find(j.Identifier, {name: 'methods'});
  if (methodsIdentifier.length === 0) {
    // this file has no "methods" object
    return jSource.toSource();
  }
  const methodsObject = methodsIdentifier
    .closest(j.Property)
    .find(j.ObjectExpression)
    .get();

  const methodFunctions = methodsObject.value.properties.filter((node) => !templateAttrs.includes(node.key.name));
  const methodsWithNoThis = methodFunctions.filter((fn) => {
    const thisExpressions = j(fn).find(j.ThisExpression);
    return thisExpressions.length === 0;
  });

  // remove methods from the instance
  methodsObject.value.properties = methodsObject.value.properties.filter((prop) => {
    return !methodsWithNoThis.includes(prop);
  });

  // add the method as a variable in the body
  const vueRoot = getClosest(methodsObject, j.ObjectExpression);
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
