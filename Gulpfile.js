'use strict';

// dependencies
var gulp = require('gulp'),
    gutil = require('gulp-util'),
    sourcemaps = require('gulp-sourcemaps'),
    uglify = require('gulp-uglify'),
    sass = require('gulp-sass')

var config = {
    paths: {
        client: './client',
        js: './client/**/*.js',
        server: './server',
        sass: './client/sass/*.scss',
        css: './public/stylesheets'
    }
};

gulp.task('default', ['sass'],
    function(){
        gutil.log('Gulped!');
    });

gulp.task('sass', function () {
     gulp.src(config.paths.sass)
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest(config.paths.css));
});



//gulp.task('sass:watch', function() {
//   gulp.watch(config.paths.sass, ['sass'])
//});