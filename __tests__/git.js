'use strict';
const assert = require('yeoman-assert');
const helpers = require('yeoman-test');

describe('bode:git', () => {
  it('creates the git config files and init the repository', () => {
    return helpers.run(require.resolve('../generators/git'))
      .withOptions({
        repositoryPath: 'yeoman/generator-bode'
      })
      .then(() => {
        assert.file('.gitignore');
        assert.file('.gitattributes');
        assert.file('.git');
      });
  });

  it('respects --generate-into option', () => {
    return helpers.run(require.resolve('../generators/git'))
      .withOptions({
        repositoryPath: 'yeoman/generator-bode',
        generateInto: 'other/'
      })
      .then(() => {
        assert.file('other/.gitignore');
        assert.file('other/.gitattributes');
        assert.file('other/.git');
      });
  });
});