const commandParser = require('../utils/commandParser');

describe('Command parser', () => {
  test('Should parse default options', () => {
    const defaultOption = 'path';
    const value = './foo/bar';
    const argv = ['node', 'file', value];

    const options = commandParser(argv, defaultOption);
    expect(options[defaultOption]).toBe(value);
  });

  test('Should parse multiple options', () => {
    const argv = ['node', 'file'].concat('--path .foo/bar --files *.js'.split(' '));

    const options = commandParser(argv);
    expect(options.path).toBe('.foo/bar');
    expect(options.files).toBe('*.js');
  });

  test('Should parse options with and without commas', () => {
    const argv = ['node', 'file'].concat('--path ".foo/bar" --files *.js'.split(' '));

    const options = commandParser(argv);
    expect(options.path).toBe('.foo/bar');
    expect(options.files).toBe('*.js');
  });
});
