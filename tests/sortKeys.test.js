const fs = require('fs');
const path = require('path');
const commandParser = require('../utils/commandParser');
const exec = require('./utils/exec');
const codemodFolder = 'sort_keys';

describe('Sort keys', () => {
  test('Should sort keys in a .vue file', (done) => {
    const FILE_PATH = path.join(__dirname, '/test_assets/' + codemodFolder + '/');
    const TRANSFORMER_PATH = path.join(__dirname, '../transformers/' + codemodFolder + '/');

    const beforeTransformation = fs.readFileSync(FILE_PATH + 'original.vue', 'utf8');
    const transformedFile = fs.readFileSync(FILE_PATH + 'transformed.vue', 'utf8');

    exec(`node ${TRANSFORMER_PATH}sortKeys.js --path ${FILE_PATH}original.vue`).then(() => {
      const afterTransformation = fs.readFileSync(FILE_PATH + 'original.vue', 'utf8');

      // restore file
      fs.writeFileSync(FILE_PATH + 'original.vue', beforeTransformation, 'utf8');
      expect(afterTransformation).toEqual(transformedFile);
      done();
    });
  });
});
