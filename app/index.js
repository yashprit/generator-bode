'use strict';
var path = require('path');
var npmName = require('npm-name');
var yeoman = require('yeoman-generator');
var color = require('colors');

module.exports = yeoman.generators.Base.extend({
  init: function() {
    this.pkg = require('../package.json');

    var bode = "\n\n" +
      "                                                 dddddddd\n".red +
      "BBBBBBBBBBBBBBBBB                                d::::::d\n".red +
      "B::::::::::::::::B                               d::::::d\n".red +
      "B::::::BBBBBB:::::B                              d::::::d\n".red +
      "BB:::::B     B:::::B                             d:::::d\n".red +
      "  B::::B     B:::::B   ooooooooooo       ddddddddd:::::d     eeeeeeeeeeee\n".red +
      "  B::::B     B:::::B oo:::::::::::oo   dd::::::::::::::d   ee::::::::::::ee\n".blue +
      "  B::::BBBBBB:::::B o:::::::::::::::o d::::::::::::::::d  e::::::eeeee:::::ee\n".blue +
      "  B:::::::::::::BB  o:::::ooooo:::::od:::::::ddddd:::::d e::::::e     e:::::e\n".blue +
      "  B::::BBBBBB:::::B o::::o     o::::od::::::d    d:::::d e:::::::eeeee::::::e\n".blue +
      "  B::::B     B:::::Bo::::o     o::::od:::::d     d:::::d e:::::::::::::::::e\n".blue +
      "  B::::B     B:::::Bo::::o     o::::od:::::d     d:::::d e::::::eeeeeeeeeee\n".magenta +
      "  B::::B     B:::::Bo::::o     o::::od:::::d     d:::::d e:::::::e\n".magenta +
      "BB:::::BBBBBB::::::Bo:::::ooooo:::::od::::::ddddd::::::dde::::::::e\n".magenta +
      "B:::::::::::::::::B o:::::::::::::::o d:::::::::::::::::d e::::::::eeeeeeee\n".magenta +
      "B::::::::::::::::B   oo:::::::::::oo   d:::::::::ddd::::d  ee:::::::::::::e\n".magenta +
      "BBBBBBBBBBBBBBBBB      ooooooooooo      ddddddddd   ddddd    eeeeeeeeeeeeee\n".magenta;

    this.log(bode +
      '\nThe name of your project shouldn\'t contain "node" or "js" and'.red +
      '\nshould be a unique ID not already in use at npmjs.org.'.red);
  },
  askForModuleName: function() {
    var done = this.async();

    var prompts = [{
      name: 'name',
      message: 'Module Name'.green,
      default: path.basename(process.cwd()),
    }, {
      type: 'confirm',
      name: 'pkgName',
      message: 'npm package already exist, please choose another name'.green,
      default: true,
      when: function(answers) {
        var done = this.async();
        npmName(answers.name, function(err, available) {
          if (!available) {
            done(true);
            return;
          }
          done(false);
        });
      }
    }];

    this.prompt(prompts, function(props) {
      if (props.pkgName) {
        return this.askForModuleName();
      }

      this.slugname = this._.slugify(props.name);
      this.safeSlugname = this.slugname.replace(/-+([a-zA-Z0-9])/g, function(g) {
        return g[1].toUpperCase();
      });
      done();
    }.bind(this));
  },

  askFor: function() {
    var cb = this.async();

    var prompts = [{
      name: 'version',
      message: 'version(0.0.0)'.green,
      default: '0.0.1'
    }, {
      name: 'description',
      message: 'Description'.green,
      default: 'This is awesome application'
    }, {
      name: 'homepage',
      message: 'Homepage'.green
    }, {
      name: 'license',
      message: 'License'.green,
      default: 'MIT'
    }, {
      name: 'githubUsername',
      message: 'GitHub username'.green,
      store: true
    }, {
      name: 'authorName',
      message: 'Author\'s Name'.green,
      store: true
    }, {
      name: 'authorEmail',
      message: 'Author\'s Email'.green,
      store: true
    }, {
      name: 'authorUrl',
      message: 'Author\'s Homepage'.green,
      store: true
    }, {
      name: 'keywords',
      message: 'Give me some Keywords (comma to split)'.green
    }, {
      type: 'confirm',
      name: 'cli',
      message: 'Lets run it from CLI'.green
    }, {
      type: 'confirm',
      name: 'browser',
      message: 'Shall I add Browserify support?'.green
    }, {
      type: "list",
      name: 'taskRunner',
      message: 'Select Task runner'.green,
      choices: [{
        name: 'gulpfile'
      }, {
        name: 'Gruntfile'
      }],
      filter: function(val) {
        return val + ".js"
      }
    }, {
      type: "list",
      name: 'test',
      message: 'Choose your test suite'.green,
      choices: [{
        name: 'node_unit'
      }, {
        name: 'mocha_chai'
      }, {
        name: 'jasmine'
      }],
      filter: function(val) {
        return val
      }
    }];

    this.currentYear = (new Date()).getFullYear();

    this.prompt(prompts, function(props) {
      if (props.githubUsername) {
        this.repoUrl = props.githubUsername + '/' + this.slugname;
      } else {
        this.repoUrl = 'user/repo';
      }

      this.keywords = props.keywords.split(',').map(function(el) {
        return el.trim();
      });

      this.props = props;

      cb();
    }.bind(this));
  },

  app: function() {
    this.config.save();
    this.copy('editorconfig', '.editorconfig');
    this.copy('gitignore', '.gitignore');
    this.copy('gitattributes', '.gitattributes');
    this.copy('travis.yml', '.travis.yml');

    this.props.unit = {
      "node_unit": true,
      "mocha_chai": false,
      "jasmine": false
    };

    for (var key in this.props.unit) {
      this.props.unit[key] = key === this.props.test ? true : false
    }

    this.template('jshintrc', '.jshintrc');

    var fileName = this.props.taskRunner
    this.template(fileName, fileName);

    this.template('README.md', 'README.md');

    this.template('_package.json', 'package.json');

    if (this.props.cli) {
      this.template('cli.js', 'cli.js');
    }
    var license = this.props.license.trim().toUpperCase();
    if (license === 'MIT') {
      this.template('MIT_LICENSE', 'LICENSE');
    }
    this.copy('CONTRIBUTING.md', 'CONTRIBUTING.md');
  },

  projectfiles: function() {
    this.mkdir('lib');
    this.template('index.js', 'lib/index.js');
    this.template('test/test.js', 'test/test.js');
  },

  install: function() {
    this.installDependencies({
      bower: false,
      skipInstall: this.options['skip-install']
    });
  }
});
