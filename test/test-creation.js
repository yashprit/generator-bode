'use strict';
var path = require('path');
var assert = require('yeoman-generator').assert;
var helpers = require('yeoman-generator').test;
var shelljs = require('shelljs');

describe('node generator', function() {
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
    'keywords': 'keyword1,keyword2,keyword3'
  }

  var defaultFile = [
    'lib/index.js',
    'test/test.js',
    '.gitignore',
    '.jshintrc',
    '.travis.yml',
    '.editorconfig',
    'package.json',
    'README.md'
  ]

  beforeEach(function(done) {
    helpers.testDirectory(path.join(__dirname, 'temp'), function(err) {
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

  it('create only npm module with gulp', function(done) {
    var expected = defaultFile.concat('gulpfile.js');

    var withCliGulp = commonConfig;
    withCliGulp.browser = false;
    withCliGulp.cli = false;
    withCliGulp.taskRunner = 'gulpfile.js';
    withCliGulp.git = false;

    helpers.mockPrompt(this.app, withCliGulp);

    this.app.run(function() {
      assert.fileContent('package.json', /"test": "gulp test"/);
      assert.file(expected);
      assert.fileContent('package.json', /"name": "mymodule"/);
      done();
    });
  });

  it('creates expected files without cli with Grunt', function(done) {
    var expected = defaultFile.concat('Gruntfile.js');

    var withoutCliGrunt = commonConfig;
    withoutCliGrunt.browser = true;
    withoutCliGrunt.cli = false;
    withoutCliGrunt.taskRunner = 'Gruntfile.js';
    withoutCliGrunt.git = false;

    helpers.mockPrompt(this.app, withoutCliGrunt);

    this.app.run(function() {
      assert.fileContent('package.json', /"url": "octocat\/mymodule\/issues"/);
      assert.file(expected);
      assert.fileContent('package.json', /"name": "mymodule"/);
      done();
    });
  });

  it('creates expected files with gulp, support cli', function(done) {
    var expected = defaultFile.concat('gulpfile.js', 'cli.js');

    var withCliGulp = commonConfig;
    withCliGulp.browser = true;
    withCliGulp.cli = true;
    withCliGulp.taskRunner = 'gulpfile.js';
    withCliGulp.git = false;

    helpers.mockPrompt(this.app, withCliGulp);

    shelljs.exec('npm install minimist', {
      silent: true
    });

    this.app.run(function() {
      assert.file(expected);
      assert.deepEqual(require('./temp/cli.js'), {});
      done();
    });
  });
});
