'use strict';

var gulp = require('gulp');
var browserSync = require('browser-sync');

var $ = require('gulp-load-plugins')();

var sassOptions = {
	    style: 'expanded'
	};

var wiredep = require('wiredep').stream;

module.exports = function(options) {
	gulp.task('appStyles', function() {

	    var injectAppFiles = gulp.src([
	        options.src + '/app/**/*.scss',
	        '!' + options.src + '/app/app.scss'
	    ], { read: false });

	    var injectOptions = {
	        transform: function(filePath) {
	            filePath = filePath.replace(options.src + '/app/', '');
	            filePath = filePath.replace(options.src + '/components/', '../components/');
	            return '@import \'' + filePath + '\';';
	        },
	        //relative: true,
	        starttag: '// injector',
	        endtag: '// endinjector',
	        addRootSlash: false
	    };

	    var indexFilter = $.filter('index.scss');
        var vendorFilter = $.filter('vendor.scss');
	    return gulp.src([
	        options.src + '/app/app.scss',
	        options.src + '/app/vendor.scss'
	    ])
	        //.pipe(indexFilter)
	        .pipe($.inject(injectAppFiles, injectOptions))
	        //.pipe(indexFilter.restore())

	        .pipe($.sass(sassOptions))

	        .pipe($.autoprefixer())
	        .on('error', function handleError(err) {
	            console.error(err.toString());
	            this.emit('end');
	        })
	        .pipe(gulp.dest(options.tmp + '/serve/app/'));
	});

	gulp.task('cmpStyles', function() {

	    var injectCmpFiles = gulp.src([
	        options.src + '/components/**/*.scss',
	        '!' + options.src + '/components/components.scss'
	    ], { read: false });

	    var injectOptions = {
	        transform: function(filePath) {
	            filePath = filePath.replace(options.src + '/app/', '../app/');
	            filePath = filePath.replace(options.src + '/components/', '');
	            return '@import \'' + filePath + '\';';
	        },
	        //relative: true,
	        starttag: '// injector',
	        endtag: '// endinjector',
	        addRootSlash: false
	    };

	    return gulp.src([
	        options.src + '/components/components.scss'
	    ])
	        .pipe($.inject(injectCmpFiles, injectOptions))
	        .pipe($.sass(sassOptions))
	        .pipe($.autoprefixer())
	        .on('error', function handleError(err) {
	            console.error(err.toString());
	            this.emit('end');
	        })
	        .pipe(gulp.dest(options.tmp + '/serve/components/'));
	});

	gulp.task('styles', ['appStyles', 'cmpStyles']);
};
