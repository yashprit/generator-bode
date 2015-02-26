'use strict';
var path 		= require('path');
var npmName = require('npm-name');
var yeoman 	= require('yeoman-generator');

module.exports = yeoman.generators.Base.extend({
  init: function () {
    this.pkg = require('../package.json');
		
		var bode = "\n\n" +
		"                                                 dddddddd\n" +                    
		"BBBBBBBBBBBBBBBBB                                d::::::d\n" +                    
		"B::::::::::::::::B                               d::::::d\n" +                    
		"B::::::BBBBBB:::::B                              d::::::d\n" +                    
		"BB:::::B     B:::::B                             d:::::d\n" +                     
		"  B::::B     B:::::B   ooooooooooo       ddddddddd:::::d     eeeeeeeeeeee\n" +    
		"  B::::B     B:::::B oo:::::::::::oo   dd::::::::::::::d   ee::::::::::::ee\n" +  
		"  B::::BBBBBB:::::B o:::::::::::::::o d::::::::::::::::d  e::::::eeeee:::::ee\n" +
		"  B:::::::::::::BB  o:::::ooooo:::::od:::::::ddddd:::::d e::::::e     e:::::e\n" +
		"  B::::BBBBBB:::::B o::::o     o::::od::::::d    d:::::d e:::::::eeeee::::::e\n" +
		"  B::::B     B:::::Bo::::o     o::::od:::::d     d:::::d e:::::::::::::::::e\n" + 
		"  B::::B     B:::::Bo::::o     o::::od:::::d     d:::::d e::::::eeeeeeeeeee\n" +  
		"  B::::B     B:::::Bo::::o     o::::od:::::d     d:::::d e:::::::e\n" +           
		"BB:::::BBBBBB::::::Bo:::::ooooo:::::od::::::ddddd::::::dde::::::::e\n" +          
		"B:::::::::::::::::B o:::::::::::::::o d:::::::::::::::::d e::::::::eeeeeeee\n" +  
		"B::::::::::::::::B   oo:::::::::::oo   d:::::::::ddd::::d  ee:::::::::::::e\n" +  
		"BBBBBBBBBBBBBBBBB      ooooooooooo      ddddddddd   ddddd    eeeeeeeeeeeeee\n";                                                                   
		
    this.log(bode +
      '\nThe name of your project shouldn\'t contain "node" or "js" and' +
      '\nshould be a unique ID not already in use at npmjs.org.');
  },
  askForModuleName: function () {
    var done = this.async();

    var prompts = [{
      name: 'name',
      message: 'Module Name',
      default: path.basename(process.cwd()),
    }, {
      type: 'confirm',
      name: 'pkgName',
      message: 'npm package already exist, please choose another name',
      default: true,
      when: function(answers) {
        var done = this.async();
        npmName(answers.name, function (err, available) {
          if (!available) {
            done(true);
            return;
          }
          done(false);
        });
      }
    }];

    this.prompt(prompts, function (props) {
      if (props.pkgName) {
        return this.askForModuleName();
      }

      this.slugname = this._.slugify(props.name);
      this.safeSlugname = this.slugname.replace(/-+([a-zA-Z0-9])/g, function (g) {
        return g[1].toUpperCase();
      });
      done();
    }.bind(this));
  },

  askFor: function () {
    var cb = this.async();

    var prompts = [{
      name: 'version',
      message: 'version(0.0.0)',
      default: '0.0.1'
    },{
      name: 'description',
      message: 'Description',
      default: 'This is awesome application'
    }, {
      name: 'homepage',
      message: 'Homepage'
    }, {
      name: 'license',
      message: 'License',
      default: 'MIT'
    }, {
      name: 'githubUserName',
      message: 'GitHub username',
      store: true
    }, {
      name: 'authorName',
      message: 'Author\'s Name',
      store: true
    }, {
      name: 'authorEmail',
      message: 'Author\'s Email',
      store: true
    }, {
      name: 'authorUrl',
      message: 'Author\'s Homepage',
      store: true
    }, {
      name: 'keywords',
      message: 'Give me some Keywords (comma to split)'
    }, {
      type: 'confirm',
      name: 'cli',
      message: 'Lets run it from CLI'
    }, {
      type: 'confirm',
      name: 'browser',
      message: 'Shall I add Browserify support?'
    }, {
    	type: "list",
			name: 'taskRunner',
			message: 'Select Task runner',
			choices:  [{name:'gulpfile'}, {name:'Gruntfile'}],
			filter: function( val ) { return val + ".js" },
			validate: function(answer){
			  if ( answer.length < 1 ) {
			  	return "You must choose at least one topping.";
			  }
			  return true;
			}
    }];

    this.currentYear = (new Date()).getFullYear();

    this.prompt(prompts, function (props) {
      if (props.githubUsername) {
        this.repoUrl = props.githubUsername + '/' + this.slugname;
      } else {
        this.repoUrl = 'user/repo';
      }

      this.keywords = props.keywords.split(',').map(function (el) {
        return el.trim();
      });

      this.props = props;

      cb();
    }.bind(this));
  },


  app: function () {
    this.config.save();
    this.copy('editorconfig', '.editorconfig');
    this.copy('jshintrc', '.jshintrc');
    this.copy('gitignore', '.gitignore');
    this.copy('gitattributes', '.gitattributes');
    this.copy('travis.yml', '.travis.yml');
		
		var fileName = this.props.taskRunner
    this.copy(fileName, fileName);

    this.template('README.md', 'README.md');

    this.template('_package.json', 'package.json');

    if (this.props.cli) {
      this.template('cli.js', 'cli.js');
    }
		var license = this.props.license.trim().toUpperCase();
		if(this.license === 'MIT') {
			this.template('MIT_LICENSE', 'LICENSE')
		}
		this.copy('CONTRIBUTING.md', 'CONTRIBUTING.md');
  },

  projectfiles: function () {
    this.template('index.js', 'index.js');
    this.mkdir('test');
    this.template('test/test.js', 'test/test.js');
  },

  install: function () {
    this.installDependencies({
      bower: false,
      skipInstall: this.options['skip-install']
    });
  }
});
