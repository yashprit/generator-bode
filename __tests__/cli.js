'use strict';
const assert = require('yeoman-assert');
const helpers = require('yeoman-test');

describe('node:cli', () => {
  beforeEach(() => {
    return helpers.run(require.resolve('../generators/cli'))
      .on('ready', generator => {
        generator.fs.write(
          generator.destinationPath('package.json'),
          '{"name": "my-lib"}'
        );
      });
  });

  it('creates cli.js with basic', () => {
    assert.file('cli.js');
    assert.fileContent('cli.js', 'const meow = require(\'meow\')');
    assert.fileContent('cli.js', 'const myLib = require(\'./\')');
  });

  it('Extends package.json', () => {
    assert.fileContent('package.json', '"bin": "cli.js"');
    assert.fileContent('package.json', '"meow"');
    assert.fileContent('package.json', /"lec": "\^/);
    assert.fileContent('package.json', '"prepublish": "lec cli.js -c LF && nsp check"');
  });
});

describe('node:cli', () => {
  beforeEach(() => {
    return helpers.run(require.resolve('../generators/cli'))
      .withOptions({boilerplate: true})
      .on('ready', generator => {
        generator.fs.write(
          generator.destinationPath('other/package.json'),
          '{"name": "my-lib"}'
        );
      });
  });

  it('creates cli.js with advance config', () => {
    assert.file('lib/cli.js');
  });
});