/*
 * The Gulpfile is responsible for holding all Gulp tasks.
 * Gulp generates a single project from a bunch of separate files,
 * and this file is responsible for telling it how to do so.
 */
'use strict';

var autoprefixer = require('gulp-autoprefixer');
var browserSync = require('browser-sync').create();
var data = require('gulp-data');
var gulp = require('gulp');
var handlebars = require('gulp-compile-handlebars');
var layouts = require('handlebars-layouts');
var plumber = require('gulp-plumber');
var reload = browserSync.reload;
var rename = require('gulp-rename');
var sass = require('gulp-sass');
var scsslint = require('gulp-scss-lint');
var server = require('gulp-express');
var sourcemaps = require('gulp-sourcemaps');

handlebars.Handlebars.registerHelper(layouts(handlebars.Handlebars));

gulp.task('sass:lint', function() {
  gulp.src('./public/sass/*.scss')
    .pipe(plumber())
    .pipe(scsslint());
});

gulp.task('sass:build', function() {
  gulp.src('./public/sass/style.scss')
    .pipe(rename({
      suffix: '.min',
    }))
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(sass({
      outputStyle: 'compressed',
    }))
    .pipe(autoprefixer())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('./public/css/'));
});

gulp.task('sass', ['sass:lint', 'sass:build']);

gulp.task('fonts', function() {
  gulp.src('./public/font/*')
    .pipe(plumber())
    .pipe(gulp.dest('./dist/font'));
});

gulp.task('templates', function() {
  var options = {
    ignorePartials: true,
    batch: ['./views/partials/'],
  };
  
  return gulp.src('./views/templates/*.hbs')
    .pipe(plumber())
    .pipe(handlebars(null, options))
    .pipe(rename(function(path) {
      path.extname = '.hbs';
    }))
    .pipe(gulp.dest('./views/layouts'));
});

gulp.task('watch', function() {
  gulp.watch(['./views/templates/*.hbs', './views/partials/*.hbs'], ['templates'], reload);
  gulp.watch(['./public/sass/*.scss'], ['sass'], reload);
});

gulp.task('build', ['sass', 'fonts', 'templates']);

gulp.task('server', function() {
  server.run(['app.js']);
  gulp.start(['watch']);
});

gulp.task('serve', ['build', 'server']);