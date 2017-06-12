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
    },<% if (testing === 'node') { var task = 'nodeunit' %>
		nodeunit: {
			all: ['test/*.js'],
			options: {
			  reporter: 'junit',
			  reporterOptions: {
			  	output: 'outputdir'
			  }
			 }
		},<% } else if (testing === 'mocha') { var task = 'mochacli'%>
    mochacli: {
      options: {
        reporter: 'nyan',
        bail: true
      },
      all: ['test/*.js']
    },<% } else if (testing === 'jasmine') { var task = 'jasmine'%>
		jasmine: {
			test: {
				src: 'test/*.js'
			}
		}, <% } else if (testing === 'jest') { var task 'jest'%>
    jest: {
      test: {
        src: '__test__/*.js'
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