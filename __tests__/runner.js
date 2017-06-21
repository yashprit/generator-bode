'use strict';
const assert = require('yeoman-assert');
const helpers = require('yeoman-test');

describe('bode:runner', () => {
  it('creates the gulp file', () => {
    return helpers.run(require.resolve('../generators/runner'))
      .withOptions({
        taskRunner: 'gulpfile'
      })
      .then(() => {
        assert.file('gulpfile.js');
      });
  });

  it('respects testing module', () => {
    return helpers.run(require.resolve('../generators/runner'))
      .withOptions({
        taskRunner: 'Gruntfile',
        test: 'node_unit'
      })
      .then(() => {
        assert.file('Gruntfile.js');
        assert.fileContent('Gruntfile.js', 'nodeunit');
      });
  });
});