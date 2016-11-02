'use strict';

import gulp from 'gulp';
import gulpLoadPlugins from 'gulp-load-plugins';
import browserSync from 'browser-sync';
import del from 'del';

const $ = gulpLoadPlugins();
const bs = browserSync.create();

var minify = false;

// Styles
// - compile Sass with LibSass
// - add vendor prefixes to CSS with Autoprefixer
// - write sourcemaps
// - reload browser

gulp.task('styles', () => {
  return gulp.src('app/styles/**/*.{scss,sass,css}')
    .pipe($.prettyerror())
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
});

// Lint
// - lint CoffeeScript with CoffeeLint
// - lint JavaScript with ESLint

gulp.task('lint', () => {
  return gulp.src('app/scripts/**/*.{coffee,js}')
    .pipe($.prettyerror())
    .pipe($.cached('lint'))
    .pipe(bs.stream({
      once: true
    }))
    .pipe($.if('*.coffee', $.coffeelint()))
    .pipe($.if('*.coffee', $.coffeelint.reporter()))
    .pipe($.if('*.js', $.eslint()))
    .pipe($.if('*.js', $.eslint.format()))
    .pipe($.if('*.js', $.if(!bs.active, $.eslint.failAfterError())));
});

// Scripts
// - compile CoffeeScript
// - write sourcemaps
// - reload browser

gulp.task('scripts', () => {
  return gulp.src('app/scripts/**/*.{coffee,js}')
    .pipe($.prettyerror())
    .pipe($.cached('scripts'))
    .pipe($.sourcemaps.init())
    .pipe($.if('*.coffee', $.coffee()))
    .pipe($.sourcemaps.write({
      includeContent: false
    }))
    .pipe(gulp.dest('.tmp/scripts'))
    .pipe(bs.stream());
});

// Templates
// - compile with ECT
// - reload browser

gulp.task('templates', () => {
  return gulp.src('app/templates/*.html')
    .pipe($.prettyerror())
    .pipe($.ect({
      ext: '.html'
    }))
    .pipe(gulp.dest('.tmp'))
    .pipe(bs.stream({
      once: true
    }));
});

// Optimize

gulp.task('optimize', ['styles', 'scripts', 'templates'], () => {
  return gulp.src([
      '.tmp/styles/**/*.css',
      '.tmp/scripts/**/*.js',
      '.tmp/*.html'
    ], {
      base: '.tmp'
    })
    .pipe($.prettyerror())
    .pipe($.if('*.html', $.useref({
      searchPath: ['.tmp', 'app', '.']
    })))
    .pipe($.cached('optimize'))
    .pipe($.if(minify, $.if('*.css', $.cssnano())))
    .pipe($.if(minify, $.if('*.js', $.uglify())))
    .pipe(gulp.dest('dist'));
});

// Images

gulp.task('images', () => {
  return gulp.src([
      'app/images/**/*',
      '!app/images/**/README*'
    ])
    .pipe($.prettyerror())
    .pipe($.cached('images'))
    .pipe($.imagemin({
      progressive: true,
      interlaced: true,
      svgoPlugins: [{
        cleanupIDs: false
      }]
    }))
    .pipe(gulp.dest('dist/images'));
});

// Fonts

gulp.task('fonts', () => {
  return gulp.src([
    'app/fonts/**/*',
    '!app/fonts/**/README*'
  ]).pipe(gulp.dest('dist/fonts'));
});

// Multimedia

gulp.task('multimedia', () => {
  return gulp.src([
    'app/multimedia/**/*',
    '!app/multimedia/**/README*'
  ]).pipe(gulp.dest('dist/multimedia'));
});

// Components

gulp.task('components', () => {
  return gulp.src([
    'app/components/**/*',
    '!app/components/**/README*',
    '!app/components/**/*.{scss,sass,coffee}'
  ], {
    dot: true
  }).pipe(gulp.dest('dist/components'));
});

// Uploads

gulp.task('uploads', () => {
  return gulp.src([
    'app/uploads/**/*',
    '!app/uploads/**/README*'
  ]).pipe(gulp.dest('dist/uploads'));
});

// Extras

gulp.task('extras', () => {
  return gulp.src([
    'app/*.*',
    '!app/README*'
  ], {
    dot: true
  }).pipe(gulp.dest('dist'));
});

// Clean

gulp.task('clean', () => {
  return del(['.tmp', 'dist']);
});

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
  gulp.watch('app/scripts/**/*.{coffee,js}', ['scripts']);
  gulp.watch('app/templates/**/*.html', ['templates']);

  gulp.watch([
    'app/images/**/*',
    'app/fonts/**/*',
    'app/multimedia/**/*',
    'app/components/**/*',
    'app/uploads/**/*',
    'app/*.*',
  ]).on('change', bs.stream);
});

gulp.task('serve', ['clean'], () => {
  return gulp.start('_serve');
});

// Build

gulp.task('_build', ['optimize', 'images', 'fonts', 'multimedia', 'components', 'uploads', 'extras'], () => {
  return gulp.src('dist/**/*').pipe($.size({
    title: 'build',
    gzip: true
  }));
});

gulp.task('build', ['clean'], () => {
  minify = true;
  return gulp.start('_build');
});

// Default

gulp.task('default', ['build']);
