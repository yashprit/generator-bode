'use strict';
const Generator = require('yeoman-generator');
const rootPkg = require('../../package.json');

module.exports = class extends Generator {
  constructor(args, options) {
    super(args, options);

    this.option('generateInto', {
      type: String,
      required: false,
      defaults: '',
      desc: 'Relocate the location of the generated files.'
    });
  }

  writing() {
    this.fs.extendJSON(this.destinationPath(this.options.generateInto, 'package.json'), {
      devDependencies: {
        browserify: '14.4.0'
      },
      scripts: {
        browser: `browserify ${this.option.path} > browser.js`
      }
    });
  }
};
