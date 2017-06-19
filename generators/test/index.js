'use strict';
const _ = require('lodash');
const Generator = require('yeoman-generator');

module.exports = class extends Generator {
  constructor(args, options) {
    super(args, options);

    this.option('generateInto', {
      type: String,
      required: false,
      default: '',
      desc: 'Relocate the location of the generated files.'
    });

    this.option('name', {
      type: String,
      required: true,
      desc: 'The new module name.'
    });

    this.option('projectRoot', {
      type: String,
      required: true,
      desc: 'Project root.'
    });

    this.option('test', {
      type: String,
      required: true,
      desc: 'Test Configuration'
    });

    this.option('boilerplate', {
      type: String,
      required: true,
      desc: 'Boilerplate code'
    });

  }

  writing() {

    var filepath = this.options.projectRoot;

    if (this.options.boilerplate && !this.options.test) {
      this.composeWith(require.resolve('generator-jest/generators/test'), {
        arguments: [filepath],
        componentName: this.options.name
      });
    } else {
      const fileDestination = `test/${this.options.name}.test.js`;
      this.fs.copyTpl(
        this.templatePath('test.js'),
        this.destinationPath(this.options.generateInto, fileDestination), {
          name: this.options.name,
          filepath: filepath
        }
      );
    }
  }
};