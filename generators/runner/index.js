'use strict';
const _ = require('lodash');
const Generator = require('yeoman-generator');

module.exports = class extends Generator {
  constructor(args, options) {
    super(args, options);

    this.option('generateInto', {
      type: String,
      required: false,
      defaults: '',
      desc: 'Relocate the location of the generated files.'
    });

    this.option('testing', {
      type: String,
      required: false,
      default: '',
      desc: 'Testing module'
    });
  }

  writing() {
    const fileName = `${this.options.taskRunner}.js` 

    this.fs.copyTpl(
      this.templatePath(fileName),
      this.destinationPath(this.options.generateInto, fileName), {
        testing: this.options.testing
      }
    );
  }
};