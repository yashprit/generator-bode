'use strict';
module.exports = function(grunt) {
  require('time-grunt')(grunt);
  require('load-grunt-tasks')(grunt);

  grunt.initConfig({
    eslint: {
      options: {
        src: ["app.js"]
      },
      gruntfile: {
        src: ['Gruntfile.js']
      },
      js: {
        src: [<%=srcPath%>]
      },
      test: {
        src: ['__test__/**/*.js']
      }
    },
    <% if (testing === 'node_unit') { var task = 'nodeunit' %>
    nodeunit: {
      all: ['__test__/*.js'],
      options: {
        reporter: 'junit',
        reporterOptions: {
          output: 'outputdir'
        }
      }
    },
    <% } else if (testing === 'mocha') { var task = 'mochacli'%>
    mochacli: {
      options: {
        reporter: 'nyan',
        bail: true
      },
      all: ['__test__/*.js']
    },
    <% } else if (testing === 'jasmine') { var task = 'jasmine'%>
    jasmine: {
      test: {
        src: '__test__/*.js'
      }
    },
    <% } else if (testing === 'jest') { var task = 'jest' %>
    jest: {
      test: {
        src: '__test__/*.js'
      }
    },
    <% } %>
  });

  grunt.registerTask('test', ['eslint', '<%= task%>']);
};