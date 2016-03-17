'use strict';

var gulp       = require('gulp');
var del        = require('del');
var browserify = require('browserify');
var babelify   = require('babelify');
var source     = require('vinyl-source-stream');


/* ************************************************************* */

var ClientJsName = 'main.js';

var Locations = {
  Src: {
    HTML: 'src/html/**/*.html',
    JS_Entry : 'src/js/main.js'
  },
  Dest: {
    Root: 'dist/',
    HTML: 'dist/',
    JS: 'dist/js'
  }
}

var BabelOptions = {}


/* ************************************************************* */

gulp.task('clean', function() {
  del(Locations.Dest.Root);
});


/* ************************************************************* */

gulp.task('js', function() {
  return browserify(Locations.Src.JS_Entry, {
      debug: true
    })
    .transform(babelify.configure(BabelOptions))
    .bundle()
    .pipe(source(ClientJsName))
    .pipe(gulp.dest(Locations.Dest.JS));
});


gulp.task('html', function() {
  gulp.src(Locations.Src.HTML)
    .pipe(gulp.dest(Locations.Dest.HTML));
});


gulp.task('build', ['html', 'js']);


gulp.task('default', ['build']);
