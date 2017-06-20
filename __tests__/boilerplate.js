'use strict';
const assert = require('yeoman-assert');
const helpers = require('yeoman-test');

describe('node:boilerplate', () => {
  beforeEach(() => {
    return helpers.run(require.resolve('../generators/boilerplate'))
      .withOptions({name: 'my-module', projectRoot: ''});
  });

  it('creates boilerplate files with basic config', () => {
    assert.file('index.js');
    //assert.file('__tests__/myModule.test.js');
    assert.fileContent('index.js', 'module.exports = {};');
    //assert.fileContent('__tests__/myModule.test.js', 'const myModule');
    //assert.fileContent('__tests__/myModule.test.js', 'describe(\'myModule\'');
  });
});

describe('node:boilerplate', () => {
  beforeEach(() => {
    return helpers.run(require.resolve('../generators/boilerplate'))
      .withOptions({name: 'my-module', projectRoot: 'lib', boilerplate: true});
  });

  it('creates boilerplate files using project root with advance config', () => {
    assert.file('lib/index.js');
    //assert.file('lib/__tests__/myModule.test.js');
    assert.fileContent('lib/index.js', 'module.exports = {};');
    //assert.fileContent('lib/__tests__/myModule.test.js', 'const myModule');
    //assert.fileContent('lib/__tests__/myModule.test.js', 'describe(\'myModule\'');
  });
});