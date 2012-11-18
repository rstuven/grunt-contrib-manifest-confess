/*
 * grunt-contrib-manifest
 * Licensed under the MIT license.
 */

var url     = require('url');
var path    = require('path');
var join    = path.join;
var fstream = require('fstream');

module.exports = function(grunt) {
  return {
    manifest: function(options, done) {
      // base directory for confess files
      var support  = join(__dirname, '../shim/');

      // default options
      grunt.util._.defaults(options, {
        url: url.format({
          protocol: 'http',
          hostname: options.hostname || 'localhost',
          port: options.port || 0
        }),
        task: 'appcache'
      });

      // slightly changed output file if task is not the usual appcache.
      if(options.task !== 'appcache') {
        options.output = options.output.replace(path.extname(options.output), '.' + options.task);
      }

      // and what command is about to run
      var args = [
        join(support, 'confess.js'),
        options.url,
        options.task,
        // should be read from gruntfile, and write to temporary file
        join(support, 'confess.json')
      ];

      grunt.log
        .subhead('Generating the cache manifest')
        .writeln('  - Command: ' + grunt.log.wordlist(['phantomjs'].concat(args), {
          separator: ' '
        }))
        .subhead('Writing to ' + options.output + '...');

      var confess = grunt.util.spawn({
        cmd: 'phantomjs',
        args: args
      }, function(err) {
        if( err ) {
          grunt.fail.fatal(err);
        }
      });

      // redirect back stderr output
      confess.stderr.pipe( process.stderr );

      // same for stdout, plus file write to final manifest file
      confess.stdout.pipe( process.stdout );

      confess.stdout.pipe( fstream.Writer(options.output) ).on('close', function() {
        grunt.log.ok();
        done();
      });
    }
  };
};

