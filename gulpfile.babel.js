'use strict';

import gulp from 'gulp';
import gulpLoadPlugins from 'gulp-load-plugins';
import gutil from 'gulp-util';
import runSequence from 'run-sequence';
import browserSync from 'browser-sync';
import del from 'del';

const $ = gulpLoadPlugins();
const bs = browserSync.create();

var minify = false;

var errorHandler = function(){
    return $.plumber(function(error){
        gutil.log(gutil.colors.bgRed.bold('\n\nError\nplugin: ' + error.plugin + '\n' + error.message));
        this.emit('end');
    });
};

// Styles
// - compile Sass with LibSass
// - add vendor prefixes to CSS with Autoprefixer
// - write sourcemaps
// - stream to browser

gulp.task('styles', () => gulp.src('app/styles/**/*.{scss,sass,css}')
  .pipe(errorHandler())
  .pipe($.sourcemaps.init())
  .pipe($.if(/\.(scss|sass)$/, $.sass.sync({
    outputStyle: 'expanded',
    precision: 10,
    includePaths: ['.']
  })))
  .pipe($.sourcemaps.write({
    includeContent: false
  }))
  .pipe($.sourcemaps.init({
    loadMaps: true
  }))
  .pipe($.autoprefixer({
    browsers: [
      '> 1%',
      'last 2 versions',
      'Firefox ESR'
    ]
  }))
  .pipe($.sourcemaps.write())
  .pipe(gulp.dest('.tmp/styles'))
  .pipe(bs.stream())
);

// Lint
// - lint CoffeeScript with CoffeeLint
// - lint JavaScript with ESLint

gulp.task('lint', () => gulp.src('app/scripts/**/*.{coffee,js}')
  .pipe(errorHandler())
  .pipe($.cached('lint'))
  .pipe($.if('*.coffee', $.coffeelint()))
  .pipe($.if('*.coffee', $.coffeelint.reporter()))
  .pipe($.if('*.js', $.eslint()))
  .pipe($.if('*.js', $.eslint.format()))
  .pipe($.if('*.js', $.if(!bs.active, $.eslint.failAfterError())))
);

// Scripts
// - compile CoffeeScript
// - write sourcemaps

gulp.task('scripts', () => gulp.src('app/scripts/**/*.{coffee,js}')
  .pipe(errorHandler())
  .pipe($.cached('scripts'))
  .pipe($.sourcemaps.init())
  .pipe($.if('*.coffee', $.coffee()))
  .pipe($.sourcemaps.write({
    includeContent: false
  }))
  .pipe(gulp.dest('.tmp/scripts'))
);

// Templates
// - compile with ECT

gulp.task('templates', () => gulp.src('app/templates/*.html')
  .pipe(errorHandler())
  .pipe($.ect({
    ext: '.html'
  }))
  .pipe(gulp.dest('.tmp'))
);

// Optimize

gulp.task('optimize', ['styles', 'scripts', 'templates'], () => gulp.src([
    '.tmp/styles/**/*.css',
    '.tmp/scripts/**/*.js',
    '.tmp/*.html'
  ], {
    base: '.tmp'
  })
  .pipe(errorHandler())
  .pipe($.if('*.html', $.useref({
    searchPath: ['.tmp', 'app', '.']
  })))
  .pipe($.cached('optimize'))
  .pipe($.if(minify, $.if('*.css', $.cssnano())))
  .pipe($.if(minify, $.if('*.js', $.uglify())))
  .pipe(gulp.dest('dist'))
);

// Images

gulp.task('images', () => gulp.src([
    'app/images/**/*',
    '!app/images/**/README*'
  ])
  .pipe(errorHandler())
  .pipe($.cached('images'))
  .pipe($.imagemin({
    progressive: true,
    interlaced: true,
    svgoPlugins: [{
      cleanupIDs: false
    }]
  }))
  .pipe(gulp.dest('dist/images'))
);

// Fonts

gulp.task('fonts', () => gulp.src([
    'app/fonts/**/*',
    '!app/fonts/**/README*'
  ])
  .pipe(gulp.dest('dist/fonts'))
);

// Multimedia

gulp.task('multimedia', () => gulp.src([
    'app/multimedia/**/*',
    '!app/multimedia/**/README*'
  ])
  .pipe(gulp.dest('dist/multimedia'))
);

// Components

gulp.task('components', () => gulp.src([
    'app/components/**/*',
    '!app/components/**/README*',
    '!app/components/**/*.{scss,sass,coffee}'
  ], {
    dot: true
  })
  .pipe(gulp.dest('dist/components'))
);

// Uploads

gulp.task('uploads', () => gulp.src([
    'app/uploads/**/*',
    '!app/uploads/**/README*'
  ])
  .pipe(gulp.dest('dist/uploads'))
);

// Extras

gulp.task('extras', () => gulp.src([
    'app/*.*',
    '!app/README*'
  ], {
    dot: true
  })
  .pipe(gulp.dest('dist'))
);

// Reload
// - reload browser

gulp.task('reload', () => bs.reload());

// Clean

gulp.task('clean', () => del(['.tmp', 'dist']));

// Serve

gulp.task('_serve', ['styles', 'scripts', 'templates'], () => {
  bs.init({
    notify: false,
    port: 9000,
    server: {
      baseDir: ['.tmp', 'app'],
      routes: {
      }
    }
  });

  gulp.watch('app/styles/**/*.{scss,sass,css}', ['styles']);
  gulp.watch('app/scripts/**/*.{coffee,js}', () => runSequence('scripts', 'reload'));
  gulp.watch('app/templates/**/*.html', () => runSequence('templates', 'reload'));

  gulp.watch([
    'app/images/**/*',
    'app/fonts/**/*',
    'app/multimedia/**/*',
    'app/components/**/*',
    'app/uploads/**/*',
    'app/*.*',
  ]).on('change', bs.reload);
});

gulp.task('serve', ['clean'], () => gulp.start('_serve'));

// Build

gulp.task('_build', ['optimize', 'images', 'fonts', 'multimedia', 'components', 'uploads', 'extras'], () => gulp.src('dist/**/*')
  .pipe($.size({
    title: 'build',
    gzip: true
  }))
);

gulp.task('build', ['clean'], () => {
  minify = true;
  return gulp.start('_build');
});

// Default

gulp.task('default', ['build']);
