'use strict';
const _ = require('lodash');
const extend = _.merge;
const Generator = require('yeoman-generator');
const parseAuthor = require('parse-author');
const githubUsername = require('github-username');
const askName = require('inquirer-npm-name');
const chalk = require('chalk');
const path = require('path');
const pkgJson = require('../../package.json');
const gitScopeConfig = require('git-scope-config')({
  scope: 'global'
});
const gitHubInit = require('github-init');

const bode = '\n\n' +
  chalk.yellow('                                                 ddddddd\n') +
  chalk.yellow('BBBBBBBBBBBBBBBBB                                d:::::d\n') +
  chalk.yellow('B::::::::::::::::B                               d:::::d\n') +
  chalk.yellow('B::::::BBBBBB:::::B                              d:::::d\n') +
  chalk.green('BB:::::B     B:::::B                             d:::::d\n') +
  chalk.green(' B::::B     B:::::B   ooooooooooo       dddddddddd:::::d     eeeeeeeeeeee\n') +
  chalk.green(' B::::B     B:::::B oo:::::::::::oo   dd:::::::::::::::d   ee::::::::::::ee\n') +
  chalk.green(' B::::BBBBBB:::::B o:::::::::::::::o d:::::::::::::::::d  e::::::eeeee:::::ee\n') +
  chalk.green(' B:::::::::::::BB  o:::::ooooo:::::od:::::::ddddd::::::d e::::::e     e:::::e\n') +
  chalk.blue(' B::::BBBBBB:::::B o::::o     o::::od::::::d    d::::::d e:::::::eeeee::::::e\n') +
  chalk.blue(' B::::B     B:::::Bo::::o     o::::od:::::d     d::::::d e:::::::::::::::::e\n') +
  chalk.blue(' B::::B     B:::::Bo::::o     o::::od:::::d     d::::::d e::::::eeeeeeeeeee\n') +
  chalk.blue(' B::::B     B:::::Bo::::o     o::::od:::::d     d::::::d e:::::::e\n') +
  chalk.red('BB:::::BBBBBB::::::Bo:::::ooooo:::::od::::::ddddd::::::d e::::::::e\n') +
  chalk.red('B:::::::::::::::::B o:::::::::::::::o d::::::::::::::::d e::::::::eeeeeeee\n') +
  chalk.red('B::::::::::::::::B   oo:::::::::::oo   d:::::::::ddd:::d  ee:::::::::::::e\n') +
  chalk.red('BBBBBBBBBBBBBBBBB      ooooooooooo      ddddddddd   dddd    eeeeeeeeeeeeee\n');

module.exports = class extends Generator {

  constructor(args, options) {
    super(args, options);

    this.option('travis', {
      type: Boolean,
      required: false,
      default: true,
      desc: 'Include travis config'
    });

    this.option('boilerplate', {
      type: Boolean,
      required: false,
      default: true,
      desc: 'Include boilerplate files'
    });

    this.option('cli', {
      type: Boolean,
      required: false,
      default: false,
      desc: 'Add a CLI'
    });

    this.option('coveralls', {
      type: Boolean,
      required: false,
      desc: 'Include coveralls config'
    });

    this.option('editorconfig', {
      type: Boolean,
      required: false,
      default: true,
      desc: 'Include a .editorconfig file'
    });

    this.option('license', {
      type: Boolean,
      required: false,
      default: true,
      desc: 'Include a license'
    });

    this.option('name', {
      type: String,
      required: false,
      desc: 'Project name'
    });

    this.option('githubAccount', {
      type: String,
      required: false,
      desc: 'GitHub username or organization'
    });

    this.option('projectRoot', {
      type: String,
      required: false,
      default: 'lib',
      desc: 'Relative path to the project code root'
    });

    this.option('readme', {
      type: String,
      required: false,
      desc: 'Content to insert in the README.md file'
    });
  }

  initializing() {
    this.pkg = this.fs.readJSON(this.destinationPath('package.json'), {});

    this.log(bode +
      chalk.cyan('\nThe name of your project shouldn\'t contain "node" or "js" and') +
      chalk.cyan('\nshould be a unique ID not already in use at npmjs.org.'));

    this.props = {
      name: this.pkg.name,
      description: this.pkg.description,
      version: this.pkg.version,
      homepage: this.pkg.homepage
    };

    if (_.isObject(this.pkg.author)) {
      this.props.authorName = this.pkg.author.name;
      this.props.authorEmail = this.pkg.author.email;
      this.props.authorUrl = this.pkg.author.url;
    } else if (_.isString(this.pkg.author)) {
      const info = parseAuthor(this.pkg.author);
      this.props.authorName = info.name;
      this.props.authorEmail = info.email;
      this.props.authorUrl = info.url;
    }
  }

  _askForModuleName() {
    if (this.pkg.name || this.options.name) {
      this.props.name = this.pkg.name || _.kebabCase(this.options.name);
      return Promise.resolve();
    }

    return askName({
      name: 'name',
      message: chalk.green('Module Name'),
      default: path.basename(process.cwd()),
      filter: _.kebabCase,
      validate(str) {
        return str.length > 0;
      }
    }, this).then(answer => {
      this.props.name = answer.name;
    });
  }

  _askFor() {
    const prompts = [{
      name: 'description',
      message: chalk.green('Description'),
      when: !this.props.description
    }, {
      name: 'homepage',
      message: chalk.green('Project homepage url'),
      when: !this.props.homepage
    }, {
      name: 'authorName',
      message: chalk.green('Author\'s Name'),
      when: !this.props.authorName,
      default: this.user.git.name(),
      store: true
    }, {
      name: 'authorEmail',
      message: chalk.green('Author\'s Email'),
      when: !this.props.authorEmail,
      default: this.user.git.email(),
      store: true
    }, {
      name: 'authorUrl',
      message: chalk.green('Author\'s Homepage'),
      when: !this.props.authorUrl,
      store: true
    }, {
      name: 'keywords',
      message: chalk.green('Package keywords (comma to split)'),
      when: !this.pkg.keywords,
      filter(words) {
        return words.split(/\s*,\s*/g);
      }
    }, {
      type: 'confirm',
      name: 'browser',
      message: chalk.green('Shall I add Browserify support?')
    }, {
      type: 'list',
      name: 'test',
      message: chalk.green('Choose your test suite'),
      default: this.props.test,
      choices: [{
        name: 'Node Unit'
      }, {
        name: 'Mocha Chai'
      }, {
        name: 'Jasmine'
      }, {
        name: 'None'
      }],
      filter: function(val) {
        return val;
      }
    }, {
      type: 'list',
      name: 'taskRunner',
      message: chalk.green('Select Task runner'),
      choices: [{
        name: 'Gulp'
      }, {
        name: 'Grunt'
      }, {
        name: 'None'
      }],
      filter: function(val) {
        return val + '.js';
      }
    }, {
      name: 'includeCoveralls',
      type: 'confirm',
      message: chalk.green('Send coverage reports to coveralls'),
      when: this.options.coveralls === undefined
    }];

    return this.prompt(prompts).then(props => {
      this.props = extend(this.props, props);
    });
  }

  _askForGithubAccount() {
    if (this.options.githubAccount) {
      this.props.githubAccount = this.options.githubAccount;
      return Promise.resolve();
    }

    return githubUsername(this.props.authorEmail)
      .then(username => username, () => '')
      .then(username => {
        return this.prompt({
          name: 'githubAccount',
          message: 'GitHub username or organization',
          default: username
        }).then(prompt => {
          this.props.githubAccount = prompt.githubAccount;
        });
      });
  }

  _askForGitRepoCreation() {
    const prompt = [{
      name: 'github',
      message: chalk.green('Create github repo with module name?'),
      required: false,
      default: true,
      type: 'confirm'
    }, {
      type: 'message',
      name: 'token',
      message: chalk.red('Github token not found, create new from here ') + chalk.blue(' https://github.com/settings/applications'),
      when: (answer) => {
        if (!answer.github) return true;

        return new Promise((resolve, reject) => {
          gitScopeConfig.get('github.token', (err, token) => {
            if (err) {
              resolve(true);
            } else {
              if (token) {
                this.props.githubToken = token;
                resolve(false);
              } else {
                resolve(true);
              }
            }
          });
        });
      }
    }];

    return this.prompt(prompt).then(props => {
      if (props.token) {
        return gitScopeConfig.set('github.token', props.token, (err, status) => {
          if (!err) {
            this.props.githubToken = props.token;
          }
          return Promise.resolve();
        });
      }
      return Promise.resolve();
    });
  }

  prompting() {
    return this._askForModuleName()
      .then(this._askFor.bind(this))
      .then(this._askForGithubAccount.bind(this))
      .then(this._askForGitRepoCreation.bind(this));
  }

  writing() {
    const currentPkg = this.fs.readJSON(this.destinationPath('package.json'), {});

    const pkg = extend({
      name: _.kebabCase(this.props.name),
      version: '0.0.0',
      description: this.props.description,
      homepage: this.props.homepage,
      author: {
        name: this.props.authorName,
        email: this.props.authorEmail,
        url: this.props.authorUrl
      },
      files: [this.options.projectRoot],
      main: path.join(this.options.projectRoot, 'index.js').replace(/\\/g, '/'),
      keywords: [],
      devDependencies: {}
    }, currentPkg);

    if (this.props.includeCoveralls) {
      pkg.devDependencies.coveralls = pkgJson.devDependencies.coveralls;
    }

    // Combine the keywords
    if (this.props.keywords && this.props.keywords.length) {
      pkg.keywords = _.uniq(this.props.keywords.concat(pkg.keywords));
    }

    // Let's extend package.json so we're not overwriting user previous fields
    this.fs.writeJSON(this.destinationPath('package.json'), pkg);
  }

  default () {
    if (this.options.travis) {
      let options = {
        config: {}
      };
      if (this.props.includeCoveralls) {
        options.config.after_script = 'cat ./coverage/lcov.info | coveralls'; // eslint-disable-line camelcase
      }
      this.composeWith(require.resolve('generator-travis/generators/app'), options);
    }

    if (this.options.editorconfig) {
      this.composeWith(require.resolve('../editorconfig'));
    }

    this.composeWith(require.resolve('../nsp'));
    this.composeWith(require.resolve('../eslint'));

    this.composeWith(require.resolve('../git'), {
      name: this.props.name,
      githubAccount: this.props.githubAccount
    });

    this.composeWith(require.resolve('generator-jest/generators/app'), {
      testEnvironment: 'node',
      coveralls: false
    });

    if (this.options.boilerplate) {
      this.composeWith(require.resolve('../boilerplate'), {
        name: this.props.name
      });
    }

    if (this.options.cli) {
      this.composeWith(require.resolve('../cli'));
    }

    if (this.options.license && !this.pkg.license) {
      this.composeWith(require.resolve('generator-license/app'), {
        name: this.props.authorName,
        email: this.props.authorEmail,
        website: this.props.authorUrl
      });
    }

    if (!this.fs.exists(this.destinationPath('README.md'))) {
      this.composeWith(require.resolve('../readme'), {
        name: this.props.name,
        description: this.props.description,
        githubAccount: this.props.githubAccount,
        authorName: this.props.authorName,
        authorUrl: this.props.authorUrl,
        coveralls: this.props.includeCoveralls,
        content: this.options.readme
      });
    }
  }

  installing() {
    this.installDependencies({
      npm:true,
      bower:false,
      callback: () => {
        if(this.props.githubToken) {
          gitHubInit({
            username: this.props.githubAccount,
            token: this.props.githubToken,
            reponame: this.props.name
          }).then(data => {
            this.log(data);
          }, err => {
            this.log(err);
          });
        } else {
          this.log(chalk.green('I am all done'));
        }
      }
    });
  }

  end() {
    this.log('Thanks for using Bode.');

    if (this.options.travis) {
      let travisUrl = chalk.cyan(`https://travis-ci.org/profile/${this.props.githubAccount || ''}`);
      this.log(`- Enable Travis integration at ${travisUrl}`);
    }

    if (this.props.includeCoveralls) {
      let coverallsUrl = chalk.cyan('https://coveralls.io/repos/new');
      this.log(`- Enable Coveralls integration at ${coverallsUrl}`);
    }
  }
};