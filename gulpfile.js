'use strict';

var gulp       = require('gulp');
var del        = require('del');
var babel      = require('gulp-babel');
var browserify = require('browserify');
var babelify   = require('babelify');
var source     = require('vinyl-source-stream');
var serve      = require('gulp-serve');


/* ************************************************************* */

var DemoJsName = 'demo.js';
var Locations = {
  Src: {
    HTML: 'src/html/**/*.html',
    JS : [
      'src/js/simian-grid.jsx',
      'src/js/enum.js',
      'src/js/util.js'
    ],
    Demo_Entry : 'src/js/demo.js'
  },
  Dest: {
    Lib: 'lib/',
    Root: 'demo/',
    HTML: 'demo/',
    JS: 'demo/js'
  }
}

var BabelOptions = {}


/* ************************************************************* */

gulp.task('clean', function() {
  return del([Locations.Dest.Root, Locations.Dest.Lib]);
});


/* ************************************************************* */

gulp.task('dist', function() {
  return gulp.src(Locations.Src.JS)
    .pipe(babel())
    .pipe(gulp.dest(Locations.Dest.Lib));
});


/* ************************************************************* */

gulp.task('demo-js', function() {
  return browserify(Locations.Src.Demo_Entry, {
      debug: true
    })
    .transform(babelify.configure(BabelOptions))
    .bundle()
    .pipe(source(DemoJsName))
    .pipe(gulp.dest(Locations.Dest.JS));
});


gulp.task('demo-html', function() {
  gulp.src(Locations.Src.HTML)
    .pipe(gulp.dest(Locations.Dest.HTML));
});


gulp.task('demo', ['demo-html', 'demo-js']);
gulp.task('d', ['demo']);


/* ************************************************************* */

gulp.task('serve', serve(Locations.Dest.Root));

gulp.task('default', ['dist', 'demo']);
