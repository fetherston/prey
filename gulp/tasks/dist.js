'use strict';

var gulp = require('gulp');
var rev = require('gulp-rev');

// Build
gulp.task('dist', ['html', 'assets:dist', 'styles:dist', 'vendor:dist', 'browserify:dist'], function() {
  return gulp.src(['.tmp/styles/*.css', '.tmp/scripts/*.js'], {base: '.tmp'})
    .pipe(gulp.dest('dist'))
    .pipe(rev())
    .pipe(gulp.dest('dist'))
    .pipe(rev.manifest())
    .pipe(gulp.dest('dist'));
});
