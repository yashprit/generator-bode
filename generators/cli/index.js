'use strict';
const _ = require('lodash');
const extend = _.merge;
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

    this.option('boilerplate', {
      type: String,
      required: false,
      defaults: '',
      desc: 'Type of configuration advance or basic'
    });
  }

  writing() {
    const fileDestination = this.options.boilerplate? 'lib/cli.js' : 'cli.js';

    const pkg = this.fs.readJSON(this.destinationPath(this.options.generateInto, 'package.json'), {});

    extend(pkg, {
      bin: fileDestination,
      dependencies: {
        meow: '^3.7.0'
      },
      devDependencies: {
        lec: '^1.0.1'
      },
      scripts: {
        prepublish: `lec ${fileDestination} -c LF && nsp check`
      }
    });

    this.fs.writeJSON(this.destinationPath(this.options.generateInto, 'package.json'), pkg);

    this.fs.copyTpl(
      this.templatePath('cli.js'),
      this.destinationPath(this.options.generateInto, fileDestination), {
        pkgName: pkg.name,
        pkgSafeName: _.camelCase(pkg.name)
      }
    );
  }
};
