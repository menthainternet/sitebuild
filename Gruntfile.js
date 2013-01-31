var fs = require('fs'),
  path = require('path'),
  connect = require('connect');

module.exports = function( grunt ) {
  'use strict';
  //
  // Grunt configuration:
  //
  // https://github.com/cowboy/grunt/blob/master/docs/getting_started.md
  //
  grunt.initConfig({

    // Project configuration
    // ---------------------

    // specify an alternate install location for Bower
    bower: {
      dir: 'app/components'
    },

    // Coffee to JS compilation
    coffee: {
      compile: {
        files: {
          'temp/scripts/*.js': 'app/scripts/**/*.coffee'
        },
        options: {
          basePath: 'app/scripts'
        }
      }
    },

    // compile .scss/.sass to .css using Compass
    compass: {
      compile: {
        // http://compass-style.org/help/tutorials/configuration-reference/#configuration-properties
        options: {
          config: 'compass.rb',
          force: true
        }
      }
    },

    // generate application cache manifest
    manifest:{
      dest: ''
    },

    // headless testing through PhantomJS
    mocha: {
      all: ['test/**/*.html']
    },

    // default watch configuration
    watch: {
      coffee: {
        files: 'app/scripts/**/*.coffee',
        tasks: 'coffee reload'
      },
      compass: {
        files: 'app/styles/**/*.{scss,sass}',
        tasks: 'compass reload'
      },
      template: {
        files: 'app/templates/**/*',
        tasks: 'template reload'
      },
      reload: {
        files: [
          'app/styles/**/*.css',
          'app/scripts/**/*.js',
          'app/images/**/*.{gif,jpg,png}',
          'app/fonts/**/*',
          'app/multimedia/**/*'
        ],
        tasks: 'reload'
      }
    },

    // default lint configuration, change this to match your setup:
    // https://github.com/cowboy/grunt/blob/master/docs/task_lint.md#lint-built-in-task
    // TODO: spec dir?
    lint: {
      files: [
        'Gruntfile.js',
        'app/scripts/**/*.js',
        'spec/**/*.js'
      ]
    },

    // specifying JSHint options and globals
    // https://github.com/cowboy/grunt/blob/master/docs/task_lint.md#specifying-jshint-options-and-globals
    jshint: {
      options: {
        curly: true,
        eqeqeq: true,
        immed: true,
        latedef: true,
        newcap: true,
        noarg: true,
        sub: true,
        undef: true,
        boss: true,
        eqnull: true,
        browser: true
      },
      globals: {
        jQuery: true
      }
    },

    // Build configuration
    // -------------------

    // the staging directory used during the process
    staging: 'temp',
    // final build output
    output: 'dist',

    mkdirs: {
      staging: 'app/'
    },

    // Below, all paths are relative to the staging directory, which is a copy
    // of the app/ directory. Any .gitignore, .ignore and .buildignore file
    // that might appear in the app/ tree are used to ignore these values
    // during the copy process.

    // concat css/**/*.css files, inline @import, output a single minified css
    css: {
      'styles/backend/editor.css': 'styles/backend/editor.css'
    },

    // renames JS/CSS to prepend a hash of their contents for easier
    // versioning
    rev: {
      scripts: 'scripts/**',
      styles: 'styles/**',
      images: 'images/**',
      fonts: 'fonts/**',
      multimedia: 'multimedia/**'
    },

    // usemin handler should point to the file containing
    // the usemin blocks to be parsed
    'usemin-handler': {
      html: 'index.html'
    },

    // update references in HTML/CSS to revved files
    usemin: {
      html: ['**/*.html'],
      css: ['**/*.css']
    },

    // HTML minification
    html: {
      files: ['**/*.html']
    },

    // Optimizes JPGs and PNGs (with jpegtran & optipng)
    img: {
      dist: '<config:rev.images>'
    },

    // rjs configuration. You don't necessarily need to specify the typical
    // `path` configuration, the rjs task will parse these values from your
    // main module, using http://requirejs.org/docs/optimization.html#mainConfigFile
    //
    // name / out / mainConfig file should be used. You can let it blank if
    // you're using usemin-handler to parse rjs config from markup (default
    // setup)
    rjs: {
      // no minification, is done by the min task
      optimize: 'none',
      baseUrl: './scripts',
      wrap: true,
      name: 'main'
    },

    // While Yeoman handles concat/min when using
    // usemin blocks, you can still use them manually
    concat: {
    },

    min: {
    },

    // Template compilation
    template: {
      html: {
        src: 'app/templates/*.html',
        dest: 'temp'
      }
    }
  });

  // Alias the `test` task to run the `mocha` task instead
  grunt.registerTask('test', 'server:phantom mocha');

  // Template compilation task
  grunt.registerMultiTask('template', 'Generates an HTML file from a specified template.', function() {
    var data = this.data,
        cb = this.async(),
        res = true,
        files = grunt.file.expandFiles(this.file.src),
        dest = grunt.template.process(data.dest),
        ECT = require('ect');

    files.forEach(function(f) {
      var fbn = path.basename(f),
          fdn = path.dirname(f),
          fdest = dest + '/' + fbn,
          renderer = new ECT({
            root: __dirname + '/' + fdn,
            ext: '.html'
          });

      renderer.render(fbn, {}, function(err, html) {
        if (err) {
          grunt.log.error(err);
          res = false;
        }
        grunt.file.write(fdest, html);
        grunt.log.writeln("HTML written to '" + fdest + "'");
      });
    });

    cb(res);
  });

  // Templating task insertion
  grunt.renameTask('clean', 'original-clean');
  grunt.registerTask('clean', 'original-clean template');

  // Build task customization
  grunt.renameTask('build', 'original-build');
  grunt.registerTask('build', 'intro clean coffee compass mkdirs usemin-handler     concat css min img     usemin          copy time');
  //                           intro clean coffee compass mkdirs usemin-handler rjs concat css min img rev usemin manifest copy time

  // Reload inject task customization to work with compiled templates
  grunt.renameHelper('reload:inject', 'reload:original-inject');

  grunt.registerHelper('reload:inject', function(opts) {
    opts = opts || {};

    return function inject(req, res, next) {

      // build filepath from req.url and deal with index files for trailing `/`
      var filepath = req.url.slice(-1) === '/' ? req.url + 'index.html' : req.url;

      // if ext is anything but .html, let it go through usual connect static
      // middleware.
      if ( path.extname( filepath ) !== '.html' ) {
        return next();
      }

      var port = res.socket.server.address().port;

      // setup some basic headers, at this point it's always text/html anyway
      res.setHeader('Content-Type', connect.static.mime.lookup(filepath));

      // can't use the ideal stream / pipe case, we need to alter the html response
      // by injecting that little livereload snippet
      filepath = path.join(opts.base, '../temp', filepath.replace(/^\//, ''));
      fs.readFile(filepath, 'utf8', function(e, body) {
        if(e) {
          // go next and silently fail
          return next();
        }

        body = body.replace(/<\/body>/, function(w) {
          return [
            "<!-- yeoman livereload snippet -->",
            "<script>document.write('<script src=\"http://'",
            " + (location.host || 'localhost').split(':')[0]",
            " + ':" + port + "/livereload.js?snipver=1\"><\\/script>')",
            "</script>",
            "",
            w
          ].join('\n');
        });

        res.end(body);
      });
    };

  });

  // override compass task to use bundler
  // @todo this should be removed later
  grunt.renameTask('compass', 'original-compass');

  (function (grunt) {
    'use strict';

    var _ = grunt.util._;

    function optsToArgs( opts ) {
      var args = [];

      Object.keys( opts ).forEach(function( el ) {
        var val = opts[ el ];

        el = el.replace( /_/g, '-' );

        if ( val === true ) {
          args.push( '--' + el );
        }

        if ( _.isString( val ) ) {
          args.push( '--' + el, val );
        }

        if( _.isArray( val ) ) {
          val.forEach(function( subval ) {
            args.push( '--' + el, subval );
          });
        }
      });

      return args;
    }

    grunt.registerMultiTask( 'compass', 'Compass task', function() {
      var cb = this.async();
      var args = optsToArgs( this.options() );

      var compass = grunt.util.spawn({
        cmd: 'bundle',
        args: ['exec', 'compass', 'compile'].concat( args )
      }, function( err, result, code ) {
        if ( /not found/.test( err ) ) {
          grunt.fail.fatal('You need to have Compass installed.');
        }
        // Since `compass compile` exits with 1 when it has nothing to compile,
        // we do a little workaround by checking stdout which is then empty
        // https://github.com/chriseppstein/compass/issues/993
        cb( code === 0 || !result.stdout );
      });

      compass.stdout.pipe( process.stdout );
      compass.stderr.pipe( process.stderr );
    });
  })(grunt);

  //override usemin:post:* tasks
  grunt.renameHelper('usemin:post:html', 'usemin:post:original-html');
  grunt.renameHelper('usemin:post:css', 'usemin:post:original-css');

  grunt.registerHelper('usemin:post:html', function(content) {
    return content;
  });

  grunt.registerHelper('usemin:post:css', function(content) {
    return content;
  });

};
