"use strict";

var gulp      = require('gulp'),
		jshint    = require('gulp-jshint'),
		gutil     = require('gulp-util');

var jsSrc = ['assets/js/**/*.js', '_includes/scripts/**/*.js', '!assets/js/view/*.js', '!assets/js/scripts.js'];
var jekyllSrc = ['./**/*.{html,css,js}', '!./_site/**/*', '!assets/plugins/**/*'];

gulp.task('default', ['jekyll', 'jshint', 'watch']);

gulp.task('watch', function() {
	gulp.watch(jsSrc, ['jshint']);
	gulp.watch(jekyllSrc, ['jekyllTest']);
});

gulp.task('jshint', function () {
	return gulp
		.src(jsSrc)
		.pipe(jshint())
		.pipe(jshint.reporter('jshint-stylish'));
});

gulp.task('jekyll', function (gulpCallBack) {
	var spawn = require('child_process').spawn;
	// After build: cleanup HTML
	var jekyll = spawn('jekyll', ['build'], {stdio: 'inherit'});

	jekyll.on('exit', function(code) {
		gulpCallBack(code === 0 ? null : 'ERROR: Jekyll process exited with code: '+code);
	});
});

gulp.task('jekyllTest', function () {
	return gutil.log('gulp is running');
});