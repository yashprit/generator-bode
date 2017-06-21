'use strict';
const _ = require('lodash');
const Generator = require('yeoman-generator');

module.exports = class extends Generator {
  constructor(args, options) {
    super(args, options);

    this.option('name', {
      type: String,
      required: true,
      desc: 'The new module name.'
    });

    this.option('projectRoot', {
      type: String,
      required: true,
      default: '',
      desc: 'Project root.'
    });

    this.option('test', {
      type: String,
      required: true,
      default: '',
      desc: 'Test Configuration'
    });

    this.option('boilerplate', {
      type: String,
      required: true,
      default: false,
      desc: 'Boilerplate code'
    });
  }

  writing() {

    var filepath = this.options.projectRoot;

    const fileDestination = `${this.options.name}.test.js`;

    if (this.options.boilerplate && !this.options.test) {
      this.composeWith(require.resolve('generator-jest/generators/test'), {
        arguments: [fileDestination],
        componentName: this.options.name
      });
    } else {
      this.fs.copyTpl(
        this.templatePath('module_test.js'),
        this.destinationPath(`__tests__/${fileDestination}`), {
          name: this.options.name,
          filepath: filepath
        }
      );
    }
  }
};