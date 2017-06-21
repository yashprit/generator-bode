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
    assert.fileContent('index.js', 'module.exports = {};');
  });
});

describe('node:boilerplate', () => {
  beforeEach(() => {
    return helpers.run(require.resolve('../generators/boilerplate'))
      .withOptions({name: 'my-module', projectRoot: 'lib', boilerplate: true});
  });

  it('creates boilerplate files using project root with advance config', () => {
    assert.file('lib/index.js');
    assert.fileContent('lib/index.js', 'module.exports = {};');
  });
});