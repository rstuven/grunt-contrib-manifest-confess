/*
 * grunt-contrib-manifest
 * Licensed under the MIT license.
 */

var url     = require('url');
var path    = require('path');
var join    = path.join;
var fstream = require('fstream');

module.exports = function(grunt) {
  'use strict';

  var helpers = require('../lib/manifest-helpers')(grunt); 

  // Launch a built-in webserver on the specified directory and run confess through phantomjs.
  //
  // This task can be used to run other confess task like performance or css,
  // and can be configured to operate on a specific subdirectory.
  //
  // - task   - first task argument is used to specify the confess task to run
  //            (default: appcache)
  // - basdir - base directory of the app to cache (default: './')
  //
  // Examples
  //
  //    grunt manifest
  //    grunt manifest:appcache:path/to/my/app
  //    grunt manifest:performance:app
  //    grunt manifest:performance:temp
  //
  // Advanced options can be configured below for expected options. Can be configures in the application gruntfile.
  //
  // Examples
  //
  //    manifest: {
  //      task: 'appcache',
  //      output: 'manifest.appcache',
  //      port: 3501,
  //      hostname: 'localhost',
  //      base: 'app/'
  //    }
  //
  //
  grunt.registerMultiTask('manifest', 'Generates an application cache manifest using Confess.js.', function() {
    
    var config = this.data;
    
    // default options
    var options = grunt.util._.defaults(config || {}, {
      // confess task, set via first grunt task arg (default: appcache)
      // performance, appcache, cssproperties
      task: this.args[0] || 'appcache',
      // output file
      output: config.dest,
      // port of the url to cache,
      port: config.port,
      // hostname of the url to cache
      hostname: 'localhost',
      // basedir
      base: path.resolve(this.args[1] || './'),
      // if the browser should be "opened" to the app to cache
      open: false,
      // if the reload snippet from livereload should be injected or not
      inject: false
    });

    // Tell grunt this task is asynchronous.
    var done = this.async();

    // start a webserver at the specified location
    //start a server before task
    /*
    grunt.helper('server', options, function(err, port) {
      if(err) {
        return done( err );
      }

      options.port = port;
      grunt.helper('manifest', options, done);
    });
    */
    //options.port = port;
    helpers.manifest(options, done);
  });

};

