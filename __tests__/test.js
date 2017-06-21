'use strict';
const assert = require('yeoman-assert');
const helpers = require('yeoman-test');

describe('bode:test', () => {
  it('Test with basic config', () => {
    return helpers.run(require.resolve('../generators/test'))
      .withOptions({
        name: 'myModule',
        test: '',
        boilerplate: false
      })
      .then(() => {
        assert.file('__tests__/myModule.test.js');
        assert.fileContent('__tests__/myModule.test.js', 'const myModule');
        assert.fileContent('__tests__/myModule.test.js', 'describe(\'myModule\'');
      });
  });

  it('Test with advance config', () => {
    return helpers.run(require.resolve('../generators/test'))
      .withOptions({
        name: 'myModule',
        test: 'node_unit',
        boilerplate: true
      })
      .then(() => {
        assert.file('__tests__/myModule.test.js');
        assert.fileContent('__tests__/myModule.test.js', 'const myModule');
        assert.fileContent('__tests__/myModule.test.js', 'describe(\'myModule\'');
      });
  });
});