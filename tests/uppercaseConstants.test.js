const fs = require('fs');
const path = require('path');
const commandParser = require('../utils/commandParser');
const exec = require('./utils/exec');
const codemodFolder = 'uppercase_constants';

describe('Uppercase constants', () => {
  describe('Options: which', () => {
    test('Should convert recurring variable names to UPPERCASE_SNAKE_CASE', (done) => {
      const FILE_PATH = path.join(__dirname, '/test_assets/' + codemodFolder + '/');
      const TRANSFORMER_PATH = path.join(__dirname, '../transformers/' + codemodFolder + '/');

      const beforeTransformation = fs.readFileSync(FILE_PATH + 'original.js', 'utf8');
      const transformedFile = fs.readFileSync(FILE_PATH + 'transformed_multiple.js', 'utf8');

      exec(
        `node ${TRANSFORMER_PATH}uppercaseConstants.js --path ${FILE_PATH}original.js --options '{"which": "multiple", "dry": false}'`,
      ).then(() => {
        const afterTransformation = fs.readFileSync(FILE_PATH + 'original.js', 'utf8');

        // restore file
        fs.writeFileSync(FILE_PATH + 'original.js', beforeTransformation, 'utf8');
        expect(afterTransformation).toEqual(transformedFile);
        done();
      });
    });

    test('Should convert all variable names to UPPERCASE_SNAKE_CASE', (done) => {
      const FILE_PATH = path.join(__dirname, '/test_assets/' + codemodFolder + '/');
      const TRANSFORMER_PATH = path.join(__dirname, '../transformers/' + codemodFolder + '/');

      const beforeTransformation = fs.readFileSync(FILE_PATH + 'original.js', 'utf8');
      const transformedFile = fs.readFileSync(FILE_PATH + 'transformed_all.js', 'utf8');

      exec(
        `node ${TRANSFORMER_PATH}uppercaseConstants.js --path ${FILE_PATH}original.js --options '{"which": "all", "dry": false}'`,
      ).then(() => {
        const afterTransformation = fs.readFileSync(FILE_PATH + 'original.js', 'utf8');

        // restore file
        fs.writeFileSync(FILE_PATH + 'original.js', beforeTransformation, 'utf8');
        expect(afterTransformation).toEqual(transformedFile);
        done();
      });
    });
  });

  describe('Options: dry', () => {
    test('Should dry and convert recurring variable names to UPPERCASE_SNAKE_CASE', (done) => {
      const FILE_PATH = path.join(__dirname, '/test_assets/' + codemodFolder + '/');
      const TRANSFORMER_PATH = path.join(__dirname, '../transformers/' + codemodFolder + '/');

      const beforeTransformation = fs.readFileSync(FILE_PATH + 'original.js', 'utf8');
      const transformedFile = fs.readFileSync(FILE_PATH + 'transformed_dry.js', 'utf8');

      exec(
        `node ${TRANSFORMER_PATH}uppercaseConstants.js --path ${FILE_PATH}original.js --options '{"which": "multiple", "dry": true}'`,
      ).then(() => {
        const afterTransformation = fs.readFileSync(FILE_PATH + 'original.js', 'utf8');

        // restore file
        fs.writeFileSync(FILE_PATH + 'original.js', beforeTransformation, 'utf8');
        expect(afterTransformation).toEqual(transformedFile);
        done();
      });
    });

    test('Should dry and convert all variable names to UPPERCASE_SNAKE_CASE', (done) => {
      const FILE_PATH = path.join(__dirname, '/test_assets/' + codemodFolder + '/');
      const TRANSFORMER_PATH = path.join(__dirname, '../transformers/' + codemodFolder + '/');

      const beforeTransformation = fs.readFileSync(FILE_PATH + 'original.js', 'utf8');
      const transformedFile = fs.readFileSync(FILE_PATH + 'transformed_dry_all.js', 'utf8');

      exec(
        `node ${TRANSFORMER_PATH}uppercaseConstants.js --path ${FILE_PATH}original.js --options '{"which": "all", "dry": true}'`,
      ).then(() => {
        const afterTransformation = fs.readFileSync(FILE_PATH + 'original.js', 'utf8');

        // restore file
        fs.writeFileSync(FILE_PATH + 'original.js', beforeTransformation, 'utf8');
        expect(afterTransformation).toEqual(transformedFile);
        done();
      });
    });
  });
});
