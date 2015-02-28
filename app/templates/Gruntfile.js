'use strict';
module.exports = function (grunt) {
  // Show elapsed time at the end
  require('time-grunt')(grunt);
  // Load all grunt tasks
  require('load-grunt-tasks')(grunt);

  grunt.initConfig({
    jshint: {
      options: {
        jshintrc: '.jshintrc',
        reporter: require('jshint-stylish')
      },
      gruntfile: {
        src: ['Gruntfile.js']
      },
      js: {
        src: ['*.js']
      },
      test: {
        src: ['test/**/*.js']
      }
    },<% if (props.unit['node_unit']) { var task = 'nodeunit' %>
		nodeunit: {
			all: ['test/*.js'],
			options: {
			  reporter: 'junit',
			  reporterOptions: {
			  	output: 'outputdir'
			  }
			 }
		},<% } else if (props.unit['mocha_chai']) { var task = 'mochacli'%>
    mochacli: {
      options: {
        reporter: 'nyan',
        bail: true
      },
      all: ['test/*.js']
    },<% } else if (props.unit['jasmine']) { var task = 'jasmine'%>
		jasmine: {
			test: {
				src: 'test/*.js'
			}
		}, <% } %>	
    watch: {
      gruntfile: {
        files: '<%%= jshint.gruntfile.src %>',
        tasks: ['jshint:gruntfile']
      },
      js: {
        files: '<%%= jshint.js.src %>',
        tasks: ['jshint:js', '<%= task%>']
      },
      test: {
        files: '<%%= jshint.test.src %>',
        tasks: ['jshint:test', '<%= task%>']
      }
    }
  });

  grunt.registerTask('test', ['jshint', '<%= task%>']);
};