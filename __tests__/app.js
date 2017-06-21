'use strict';
const _ = require('lodash');
const assert = require('yeoman-assert');
const helpers = require('yeoman-test');

describe('bode:app', () => {
  beforeEach(() => {
    jest.mock('npm-name', () => {
      return () => Promise.resolve(true);
    });

    jest.mock('github-username', () => {
      return () => Promise.resolve('unicornUser');
    });

    jest.mock('generator-license/app', () => {
      const helpers = require('yeoman-test');
      return helpers.createDummyGenerator();
    });
  });

  describe('running on advance config project', () => {
    it('scaffold a full project', () => {
      const answers = {
        name: 'generator-bode',
        description: 'A node generator',
        homepage: 'http://yashprit.com',
        githubAccount: 'yashprit',
        authorName: 'Yashprit',
        authorEmail: 'yashprit@yashprit.com',
        authorUrl: 'http://yashprit.com',
        keywords: ['foo', 'bar'],
        boilerplate: true,
        cli: true,
        test: 'node_unit',
        includeCoveralls: true
      };
      return helpers.run(require.resolve('../generators/app'))
        .withPrompts(answers)
        .then(() => {
          assert.file([
            '.travis.yml',
            '.editorconfig',
            '.gitignore',
            '.gitattributes',
            'README.md',
            'lib/index.js',
            'lib/cli.js',
            '__tests__/generatorBode.test.js'
          ]);

          assert.file('package.json');
          assert.jsonFileContent('package.json', {
            name: 'generator-bode',
            version: '0.0.0',
            description: answers.description,
            homepage: answers.homepage,
            repository: `yashprit/generator-bode`,
            author: {
              name: answers.authorName,
              email: answers.authorEmail,
              url: answers.authorUrl
            },
            files: ['lib'],
            keywords: answers.keywords,
            main: 'lib/index.js'
          });

          assert.file('README.md');
          assert.fileContent('README.md', 'const generatorBode = require(\'generator-bode\');');
          assert.fileContent('README.md', '> A node generator');
          assert.fileContent('README.md', '$ npm install --save generator-bode');
          assert.fileContent('README.md', '© [Yashprit](http://yashprit.com)');
          assert.fileContent('README.md', '[travis-image]: https://travis-ci.org/yashprit/generator-bode.svg?branch=master');
          assert.fileContent('README.md', 'coveralls');

          assert.fileContent('.travis.yml', '| coveralls');
        });
    });
  });

  describe('--no-travis', () => {
    it('skip .travis.yml', () => {
      return helpers.run(require.resolve('../generators/app'))
        .withOptions({travis: false})
        .then(() => assert.noFile('.travis.yml'));
    });
  });

  describe('--projectRoot', () => {
    it('include the raw files', () => {
      return helpers.run(require.resolve('../generators/app'))
        .withOptions({boilerplate: true, projectRoot: 'generators'})
        .then(() => {
          assert.jsonFileContent('package.json', {
            files: ['generators'],
            main: 'generators/index.js'
          });
        });
    });
  });

  describe('--no-editorconfig', () => {
    it('include the raw files', () => {
      return helpers.run(require.resolve('../generators/app'))
        .withOptions({editorconfig: false})
        .then(() => assert.noFile('.editorconfig'));
    });
  });
});
