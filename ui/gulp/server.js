'use strict';

var gulp = require('gulp');
var browserSync = require('browser-sync');
var browserSyncSpa = require('browser-sync-spa');

var util = require('util');

var proxy= require('./proxy');
var http = require('http');
var path = require("path"); 
var fs = require("fs"); 	
var url = require('url');
var https = require('https');


function getFile(localPath, res, mimeType) {
	fs.readFile(localPath, function(err, contents) {
		if(!err) {
			res.setHeader("Content-Length", contents.length);
			res.setHeader("Content-Type", mimeType);
			res.statusCode = 200;
			res.end(contents);
		} else {
			res.writeHead(500);
			res.end();
		}
	});
}

module.exports = function(options) {

  function browserSyncInit(baseDir, files,proxyTarget) {
    var browser = 'default',
    routes = null,
    middleware = [];
    if(baseDir === options.src || (util.isArray(baseDir) && baseDir.indexOf(options.src) !== -1)) {
      routes = {
        '/bower_components': 'bower_components',
        '/node_modules' : 'node_modules'
      };
    }
    
    if (proxyTarget) {
        middleware.push(proxy(proxyTarget));
    }
    
    var server = {
      baseDir: baseDir,
      routes: routes
    };

    if(middleware.length > 0) {
      server.middleware = middleware;
    }

    browserSync.instance = browserSync.init({
      files: files,
      startPath: '/',
      port: 9000,
      open: "external",
      server: server,
      browser: browser, 
      ui: {
	 port: 9001
      }
    });
  }

  browserSync.use(browserSyncSpa({
    selector: '[ng-app]'// Only needed for angular apps
  }));
  
  function getFiles() {
	    return [
	        options.tmp + '/serve/{app,components}/**/*.css',
	        options.tmp + '/serve/{app,components}/**/*.js',
	        options.src + 'src/assets/images/**/*',
	        options.tmp + '/serve/*.html',
	        options.tmp + '/serve/{app,components}/**/*.html',
	        options.src + '/{app,components}/**/*.html'
	    ];
	}

  gulp.task('mock', ['stubby', 'watch'], function() {
	    /*
	     * mock server location
	     */
	    var proxyTarget = {
	        host: 'localhost',
	        port: 8000
	    };

	    browserSyncInit([options.tmp + '/serve', options.src], getFiles() , proxyTarget);
	});
  
  gulp.task('server', ['build'], function () {
	  var proxyTarget = {
			  host: 'api.cclearly.com'
	  };

	  var cred = {
			  key: fs.readFileSync('/var/aps/ssl/km.cclearly.com.key'),
			  cert: fs.readFileSync('/var/aps/ssl/km.cclearly.com.crt')
	  };

	  var server = https.createServer(cred,function(req, res) {

		  var fileHandler = function(){
			  var localPath = options.dist;

			  var filename = "/index.html";
			  if(req.url && req.url !== '/'){
				  var filename = req.url;
			  }

			  if(req.url.indexOf('?') > 0){
				  var realUrl = req.url.substring(0,req.url.indexOf('?'));   
			  }

			  var ext = path.extname(filename);		
			  var validExtensions = {
					  ".html" : "text/html",			
					  ".js": "application/javascript", 
					  ".json": "application/json",
					  ".css": "text/css",
					  ".txt": "text/plain",
					  ".jpg": "image/jpeg",
					  ".gif": "image/gif",
					  ".png": "image/png",
					  ".woff2": "application/font-woff2"

			  };
			  var isValidExt = validExtensions[ext];

			  if(realUrl  && realUrl !== req.url){
				  filename = realUrl;
			  }
			  localPath += filename;

			  path.exists(localPath, function(exists) {
				  if(exists) {
					  getFile(localPath, res, isValidExt);
				  } else {
					  console.log("File not found: " + localPath);
					  res.writeHead(404);
					  res.end();
				  }
			  });

		  }
		  proxy(proxyTarget)(req, res, fileHandler);
	  }).listen(443);
  });
  
  gulp.task('dev', ['watch'], function () {
	  	var proxyTarget = {
		        host: 'localhost',
		        port: '8080'
	  		};
	    browserSyncInit([options.tmp + '/serve', options.src], getFiles(), proxyTarget);
	  });

  gulp.task('serve:dist', ['build'], function () {
    browserSyncInit(options.dist);
  });

  gulp.task('serve:e2e', ['inject'], function () {
	  browserSyncInit([options.tmp + '/serve', options.src],getFiles());
  });
  
};
