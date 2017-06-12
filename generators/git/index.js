'use strict';
const Generator = require('yeoman-generator');
const originUrl = require('git-remote-origin-url');
const gitHubInit = require('github-init');

module.exports = class extends Generator {
  constructor(args, options) {
    super(args, options);

    this.option('generateInto', {
      type: String,
      required: false,
      defaults: '',
      desc: 'Relocate the location of the generated files.'
    });

    this.option('name', {
      type: String,
      required: true,
      desc: 'Module name'
    });

    this.option('github-account', {
      type: String,
      required: true,
      desc: 'GitHub username or organization'
    });

    this.option('github-account-creation', {
      type: String,
      required: false,
      desc: 'Create GitHub repo and commit intial code'
    });
  }

  initializing() {
    this.fs.copy(
      this.templatePath('gitattributes'),
      this.destinationPath(this.options.generateInto, '.gitattributes')
    );

    this.fs.copy(
      this.templatePath('gitignore'),
      this.destinationPath(this.options.generateInto, '.gitignore')
    );

    return originUrl(this.destinationPath(this.options.generateInto))
      .then(function(url) {
        this.originUrl = url;
      }.bind(this), function() {
        this.originUrl = '';
      }.bind(this));
  }

  writing() {
    this.pkg = this.fs.readJSON(this.destinationPath(this.options.generateInto, 'package.json'), {});

    let repository = '';
    if (this.originUrl) {
      repository = this.originUrl;
    } else {
      repository = this.options.githubAccount + '/' + this.options.name;
    }

    this.pkg.repository = this.pkg.repository || repository;

    this.fs.writeJSON(this.destinationPath(this.options.generateInto, 'package.json'), this.pkg);
  }

  end() {
    if (this.options.githubToken) {
      gitHubInit({
        username: this.options.githubAccount,
        token: this.options.githubToken,
        reponame: this.options.name
      }).then(data => {
        this.log(data);
        this.log('\nThanks for using Bode.');
      }, err => {
        this.log(err);
        this.log('\nThanks for using Bode.');
      });
    }
  }
};