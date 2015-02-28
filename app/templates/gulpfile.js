'use strict';
var gulp = require('gulp'),
	jshint = require('gulp-jshint'),<%if(props.unit['node_unit']){%>
	nodeunit = require('gulp-nodeunit');<%} else if(props.unit['mocha_chai']){%>
	mocha = require('gulp-mocha');<%} else if(props.unit['jasmine']){%>
	jasmine = require('gulp-jasmine');<%}%>
		
gulp.task('lint', function() {
	return gulp.src(['*.js'])
		.pipe(jshint())
		.pipe(jshint.reporter('default'));
});
<% if (props.unit['node_unit']) { %>
gulp.task('test', function() {
	return gulp.src('test/*.js').pipe(nodeunit());
});
<%} else if (props.unit['mocha_chai']) { %>
gulp.task('test', function() {
  return gulp.src('test/*.js').pipe(mocha());
});
<% } else if (props.unit['jasmine']) { %>
gulp.task('test', function() {
	return gulp.src('test/*.js').pipe(jasmine());
});
<% } %>

// Watch Files For Changes
gulp.task('watch', function() {
  gulp.watch('<%%= jshint.js.src %>', ['lint']);
  gulp.watch(['<%%= jshint.js.src %>', '<%%= jshint.test.src %>'], ['lint', 'test']);
});

gulp.task('default', ['lint', 'test', 'watch']);
