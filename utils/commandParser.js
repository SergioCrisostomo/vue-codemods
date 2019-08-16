module.exports = (argv, defaultOption) => {
  const [, , ...args] = argv;

  if (args.length === 1) {
    return {
      [defaultOption]: args[0],
    };
  }

  if (args.length % 2 !== 0) {
    throw new Error('Key/Value pairs could not be processed.\nCheck that each option has a value.');
  }

  return args.reduce((options, arg, i, arr) => {
    if (i % 2 === 0) {
      // its a key, lets wait for the value
      return options;
    } else {
      let value = arg.replace(/^"|"$/g, '');
      const key = arr[i - 1].slice(2);
      return {
        ...options,
        [key]: value,
      };
    }
  }, {});
};
