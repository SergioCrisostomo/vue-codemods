const fs = require('fs');
const path = require('path');
const commandParser = require('../utils/commandParser');
const exec = require('./utils/exec');
const codemodFolder = 'extract_non_instance_methods';

describe('Extract non instance methods', () => {
  test('Should move all methods that do not depend on `this`, and declare them outside the Vue object', (done) => {
    const FILE_PATH = path.join(__dirname, '/test_assets/' + codemodFolder + '/');
    const TRANSFORMER_PATH = path.join(__dirname, '../transformers/' + codemodFolder + '/');

    const beforeTransformation = fs.readFileSync(FILE_PATH + 'original.vue', 'utf8');
    const transformedFile = fs.readFileSync(FILE_PATH + 'transformed.vue', 'utf8');

    exec(`node ${TRANSFORMER_PATH}extractNonInstanceMethods.js --path ${FILE_PATH}original.vue`).then(() => {
      const afterTransformation = fs.readFileSync(FILE_PATH + 'original.vue', 'utf8');

      // restore file
      fs.writeFileSync(FILE_PATH + 'original.vue', beforeTransformation, 'utf8');
      expect(afterTransformation).toEqual(transformedFile);
      done();
    });
  });
});
