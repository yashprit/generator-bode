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

    this.option('taskRunner', {
      type: String,
      required: false,
      default: 'gulpfile',
      desc: 'TaskRunner module'
    });

    this.option('testing', {
      type: String,
      required: false,
      default: '',
      desc: 'Testing module'
    });
  }

  writing() {
    const fileName = `${this.options.taskRunner}.js`;

    var avaibleTest = this.options.testing;

    if (this.options.taskRunner == 'gulpfile') {
      var devDependencies = {
        'gulp': '^3.9.1',
        'gulp-eslint': '^4.0.0'
      }

      var test = 'gulp'

      if (avaibleTest === 'node_unit') {
        devDependencies['gulp-nodeunit'] = '^0.1.0';
      } else if (avaibleTest === 'mocha') {
        devDependencies['gulp-mocha'] = '^4.3.1';
        devDependencies['chai'] = '^4.0.2';
      } else if (avaibleTest === 'jasmine') {
        devDependencies['gulp-jasmine'] = '^2.4.2 ';
      }
    }

    if (this.options.taskRunner == 'Gruntfile') {
      var devDependencies = {
        'grunt-cli': '^1.2.0',
        'grunt-contrib-eslint': '^0.0.5',
        'grunt-contrib-watch': '^1.0.0',
        'load-grunt-tasks': '^3.5.2',
        'time-grunt': '^1.4.0'
      }

      var test = 'grunt'

      if (avaibleTest === 'node_unit') {
        devDependencies['grunt-contrib-nodeunit'] = '^1.0.0';
      } else if (avaibleTest === 'mocha') {
        devDependencies['grunt-mocha-cli'] = '^3.0.0';
        devDependencies['chai'] = '^4.0.2';
      } else if (avaibleTest === 'jasmine') {
        devDependencies['grunt-contrib-jasmine'] = '^1.1.0';
      }
    }

    const pkgJson = {
      devDependencies: devDependencies,
      scripts: {
        test: test
      }
    };

    this.fs.extendJSON(
      this.destinationPath(this.options.generateInto, 'package.json'),
      pkgJson
    );

    this.fs.copyTpl(
      this.templatePath(fileName),
      this.destinationPath(this.options.generateInto, fileName), {
        testing: avaibleTest,
        srcPath: this.options.projectRoot
      }
    );
  }
};