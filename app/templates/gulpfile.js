'use strict';
var gulp 			= require('gulp'),
		nodeunit 	= require('gulp-nodeunit'),
		jshint 		= require('gulp-jshint');
 

gulp.task('lint', function() {
	return gulp.src(['*.js'])
		        .pipe(jshint())
		        .pipe(jshint.reporter('default'));
});
 
gulp.task('tests', function() {
	gulp.src('**/*.test.js')
      .pipe(nodeunit({
      	reporter: 'junit',
        reporterOptions: {
        	output: 'test'
        }
    }));
});

// Watch Files For Changes
gulp.task('watch', function() {
	gulp.watch('<%%= jshint.js.src %>', ['lint']);
	gulp.watch(['<%%= jshint.js.src %>', '<%%= jshint.test.src %>'], ['lint', 'test']);
});
				
gulp.task('default', ['lint', 'test', 'watch']);
