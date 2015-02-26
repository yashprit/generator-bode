'use strict';
var path = require('path');
var assert = require('yeoman-generator').assert;
var helpers = require('yeoman-generator').test;
var shelljs = require('shelljs');

describe('node generator', function () {
	var commonConfig = {
    'name': 'mymodule',
    'description': 'awesome module',
    'pkgName': false,
    'license': 'MIT',
    'homepage': 'http://sample.io',
    'githubUsername': 'octocat',
    'authorName': 'Octo Cat',
    'authorEmail': 'octo@example.com',
    'authorUrl': 'http://sample.io',
    'keywords': 'keyword1,keyword2,keyword3',
		'browser': true
  }
  beforeEach(function (done) {
    helpers.testDirectory(path.join(__dirname, 'temp'), function (err) {
      if (err) {
        done(err);
        return;
      }

      this.app = helpers.createGenerator('bode:app', [
        '../../app'
      ]);
      this.app.options['skip-install'] = true;
      done();
    }.bind(this));
  });

  it('creates expected files with gulp', function (done) {
    var expected = [
      'index.js',
      'cli.js',
      'test/test.js',
      '.gitignore',
      '.jshintrc',
      '.travis.yml',
      '.editorconfig',
      'gulpfile.js',
      'package.json',
      'README.md'
    ];
		
		
		var withCliGulp = commonConfig;
		withCliGulp.cli = true;
		withCliGulp.taskRunner = 'gulpfile.js';

    helpers.mockPrompt(this.app, withCliGulp);

    shelljs.exec('npm install meow', {silent: true});

    this.app.run(function () {
      assert.file(expected);
      assert.fileContent('package.json', /"name": "mymodule"/);
      assert.deepEqual(require('./temp/cli.js'), {});
      done();
    });

  });

  it('creates expected files without cli with Grunt', function (done) {
    var expected = [
      'index.js',
      'test/test.js',
      '.gitignore',
      '.jshintrc',
      '.travis.yml',
      'Gruntfile.js',
      'package.json',
      'README.md'
    ];
		
		var withoutCliGrunt = commonConfig;
		withoutCliGrunt.cli = false;
		withoutCliGrunt.taskRunner = 'Gruntfile.js';

    helpers.mockPrompt(this.app, withoutCliGrunt);

    this.app.run(function () {
      assert.file(expected);
      assert.fileContent('package.json', /"name": "mymodule"/);
      done();
    });
  });
});