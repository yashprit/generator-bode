'use strict';
var gulp = require('gulp'),
  eslint = require('gulp-eslint'),
  <% if(testing === 'node_unit'){ %>
nodeunit = require('gulp-nodeunit');
<% } else if (testing === 'mocha'){ %>
mocha = require('gulp-mocha');
<% } else if(testing === 'jasmine'){ %>
jasmine = require('gulp-jasmine');
<%}%>

<% if (testing === 'node_unit') { %>
gulp.task('test', function() {
  return gulp.src('__test__/*.js').pipe(nodeunit());
});
<% } else if (testing === 'mocha') { %>
gulp.task('test', function() {
  return gulp.src('__test__/*.js').pipe(mocha());
});
<% } else if (testing === 'jasmine') { %>
gulp.task('test', function() {
  return gulp.src('__test__/*.js').pipe(jasmine());
});
<% } else if (testing === 'jest') { %>
gulp.task('test', function() {
  return gulp.src('__test__/*.js').pipe(jasmine());
});
<% } %>

gulp.task('lint', () => {
  return gulp.src(['<%= srcPath %>'], '!node_modules/**'])
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
});

gulp.task('default', ['lint', 'test']);