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
	        .pipe($.jshint.reporter('jshint-stylish'));
	});

	gulp.task('analyze',['jshint','test']);
	
	gulp.task('serve:e2e', ['inject'], function () {
	    browserSyncInit([options.tmp + '/serve', options.src],getFiles());
	  });

	  gulp.task('serve:e2e-dist', ['build'], function () {
	    browserSyncInit(options.dist);
	  });

}

