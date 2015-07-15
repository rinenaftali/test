'use strict';

var gulp = require('gulp');
var stubbyServer = require('gulp-stubby-server');

var paths = gulp.paths;


module.exports = function(options) {
	gulp.task('stubby', function(done) {
	    var options = {
	        callback: function(server/*, options*/) {
	            server.get(1, function(err, endpoint) {
	                if (!err) {
	                    console.log(endpoint);
	                }
	            });
	        },
	        stubs: 8000,
	        tls: 8443,
	        admin: 8010,
	        files: ['src/mocks/conf/*.js'],
	        relativeFilesPath: true,
	        mute: false
	    };

	    stubbyServer(options, done);
	});
	
}
