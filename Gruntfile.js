var fs = require('fs'),
  path = require('path'),
  open = require('open'),
  connect = require('connect'),
  regbuild = /<!--\s*build:(\w+)\s*(.+)\s*-->/,
  regend = /<!--\s*endbuild\s*-->/;

function getBlocks(body) {
  var lines = body.replace(/\r\n/g, '\n').split(/\n/),
    block = false,
    sections = {},
    last;

  lines.forEach(function(l) {
    var build = l.match(regbuild),
      endbuild = regend.test(l);

    if(build) {
      block = true;
      sections[[build[1], build[2].trim()].join(':')] = last = [];
    }

    // switch back block flag when endbuild
    if(block && endbuild) {
      last.push(l);
      block = false;
    }

    if(block && last) {
      last.push(l);
    }
  });

  return sections;
}

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
      'styles/backend/editor.css': 'styles/backend/editor.css',
      'styles/backend/main.css': 'styles/backend/main.css',
      'styles/sitebuild/main.css': 'styles/sitebuild/main.css'
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

  // server:prj watch configuration
  grunt.util._.contains(grunt.cli.tasks, 'server:prj') &&
  grunt.config('watch', {
    coffee: {
      files: 'app/scripts/**/*.coffee',
      tasks: 'coffee mkdirs reload'
    },
    compass: {
      files: 'app/styles/**/*.{scss,sass}',
      tasks: 'compass mkdirs reload'
    },
    template: {
      files: 'app/templates/**/*',
      tasks: 'template reload'
    },
    reload_css_js: {
      files: [
        'app/styles/**/*.css',
        'app/scripts/**/*.js'
      ],
      tasks: 'mkdirs reload'
    },
    reload_others: {
      files: [
        'app/images/**/*.{gif,jpg,png}',
        'app/fonts/**/*',
        'app/multimedia/**/*'
      ],
      tasks: 'mkdirs reload'
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

  // Server task customization
  grunt.renameTask('server', 'original-server');

  grunt.registerTask('server', 'Launch a preview, LiveReload compatible server', function(target) {
    var opts;
    // Get values from config, or use defaults.
    var port = grunt.config('server.port') || 0xDAD;

    // async task, call it (or not if you wish to use this task standalone)
    var cb = this.async();

    // valid target are app (default), prod and test
    var targets = {
      // these paths once config and paths resolved will need to pull in the
      // correct paths from config
      app: path.resolve('app'),
      prj: path.resolve('app'),
      dist: path.resolve('dist'),
      test: path.resolve('test'),

      // phantom target is a special one: it is triggered
      // before launching the headless tests, and gives
      // to phantomjs visibility on the same paths a
      // server:test have.
      phantom: path.resolve('test'),

      // reload is a special one, acting like `app` but not opening the HTTP
      // server in default browser and forcing the port to LiveReload standard
      // port.
      reload: path.resolve('app')
    };

    target = target || 'app';

    // yell on invalid target argument
    if(!targets[target]) {
      grunt
        .log.error('Not a valid target: ' + target)
        .writeln('Valid ones are: ' + grunt.log.wordlist(Object.keys(targets)));
      return false;
    }

    var tasks = {
      // We do want our coffee, and compass recompiled on change
      // and our browser opened and refreshed both when developping
      // (app) and when writing tests (test)
      app: 'clean coffee compass open-browser watch',
      prj: 'clean coffee compass mkdirs symlink open-browser watch',
      test: 'clean coffee compass open-browser watch',
      // Before our headless tests are run, ensure our coffee
      // and compass are recompiled
      phantom: 'clean coffee compass',
      dist: 'watch',
      reload: 'watch'
    };

    opts = {
      // prevent browser opening on `reload` target
      open: target !== 'reload',
      // and force 35729 port no matter what when on `reload` target
      port: target === 'reload' ? 35729 : port,
      base: targets[target],
      inject: true,
      target: target,
      hostname: grunt.config('server.hostname') || 'localhost'
    };

    grunt.helper('server', opts, cb);

    grunt.registerTask('open-browser', function() {
        if ( opts.open ) {
          open( 'http://' + opts.hostname + ':' + opts.port );
        }
    });

    grunt.task.run( tasks[target] );
  });

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

  //override usemin-handler task
  grunt.renameHelper('usemin-handler', 'original-usemin-handler');

  grunt.registerMultiTask('usemin-handler', 'Using HTML markup as the primary source of information', function() {
    // collect files
    var files = grunt.file.expandFiles(this.data);

    // concat / min / css / rjs config
    var concat = grunt.config('concat') || {},
      min = grunt.config('min') || {},
      css = grunt.config('css') || {},
      rjs = grunt.config('rjs') || {};

    grunt.log
      .writeln('Going through ' + grunt.log.wordlist(files) + ' to update the config')
      .writeln('looking for build script HTML comment blocks');

    files = files.map(function(filepath) {
      return {
        path: filepath,
        body: grunt.file.read(filepath)
      };
    });

    files.forEach(function(file) {
      var blocks = getBlocks(file.body);
      Object.keys(blocks).forEach(function(dest) {
        var lines = blocks[dest].slice(1, -1),
          parts = dest.split(':'),
          type = parts[0],
          output = parts[1];
        // Handle absolute path (i.e. with respect to th eserver root)
        if (output[0] === '/') {
          output = output.substr(1);
        }

        // parse out the list of assets to handle, and update the grunt config accordingly
        var assets = lines.map(function(tag) {
          var asset = (tag.match(/\<\!--.*--\>/) || (tag.match(/(href|src)=["']([^'"]+)["']/) || []))[2];

          // RequireJS uses a data-main attribute on the script tag to tell it
          // to load up the main entry point of the amp app
          //
          // First time we findd one, we update the name / mainConfigFile
          // values. If a name of mainConfigFile value are already set, we skip
          // it, so only one match should happen and default config name in
          // original Gruntfile is used if any.
          var main = tag.match(/data-main=['"]([^'"]+)['"]/);
          if(main) {
            rjs.out = rjs.out || output;
            rjs.name = rjs.name || main[1];
            asset += ',' + output;
          }

          return asset;
        }).reduce(function(a, b) {
          b = ( b ? b.split(',') : '');
          return a.concat(b);
        }, []);

        grunt.log.subhead('Found a block:')
          .writeln(grunt.log.wordlist(lines, { separator: '\n' }))
          .writeln('Updating config with the following assets:')
          .writeln('    - ' + grunt.log.wordlist(assets, { separator: '\n    - ' }));

        // update concat config for this block
        concat[output] = assets;
        grunt.config('concat', concat);

        // update rjs config as well, as during path lookup we might have
        // updated it on data-main attribute
        grunt.config('rjs', rjs);

        // min config, only for js type block
        if(type === 'js') {
          min[output] = output;
          grunt.config('min', min);
        }

        // css config, only for css type block
        if(type === 'css') {
          css[output] = output;
          grunt.config('css', css);
        }
      });
    });

    // log a bit what was added to config
    grunt.log.subhead('Configuration is now:')
      .subhead('  css:')
      .writeln('  ' + grunt.helper('inspect', css))
      .subhead('  concat:')
      .writeln('  ' + grunt.helper('inspect', concat))
      .subhead('  min:')
      .writeln('  ' + grunt.helper('inspect', min))
      .subhead('  rjs:')
      .writeln('  ' + grunt.helper('inspect', rjs));

  });

  // Symlink task
  grunt.registerTask('symlink', 'Links the staging(temp/) folder to output (dist/) one', function() {
    this.requiresConfig('staging', 'output');

    var config = grunt.config(),
      cb = this.async();

    grunt.file.setBase(config.base);

    fs.symlink(config.staging, config.output, function(e) {
      if ( e ) {
        grunt.log.error( e.stack || e.message );
      } else {
        grunt.log.ok( path.resolve( config.staging ) + ' -> ' + path.resolve( config.output ) );
      }
      cb(!e);
    });
  });
};
