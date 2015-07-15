'use strict';

var gulp = require('gulp');

var $ = require('gulp-load-plugins')({
    pattern: ['gulp-*', 'plato']
});



module.exports = function(options) {
	var jsfiles = [
	               options.src + '/**/*.js',
	               options.e2e + '/**/*.js',
	               './*.js'
	           ];
	/**
	 * JSHint the code
	 * @return {Stream}
	 */
	gulp.task('jshint', function() {
	    console.log('Analyzing source with JSHint');

	    return gulp
	        .src(jsfiles)
	        .pipe($.jshint())
	        .pipe($.jshint.reporter('jshint-stylish'))
	    	.pipe($.jshint.reporter('fail'));
	});

	gulp.task('analyze',['jshint','test']);
}

