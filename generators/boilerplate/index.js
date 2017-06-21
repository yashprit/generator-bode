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

    this.option('boilerplate', {
      type: String,
      required: true,
      desc: 'Basic or Advance configuration.'
    });

    this.option('projectRoot', {
      type: String,
      required: false,
      default: '',
      desc: 'Root Project'
    })
  }

  writing() {
    const fileDestination = this.options.boilerplate? `${this.options.projectRoot}/index.js` : 'index.js';

    const filepath = this.destinationPath(fileDestination);

    this.fs.copyTpl(this.templatePath('index.js'), filepath);

  }
};
