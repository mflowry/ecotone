'use strict';

// dependencies
var gulp = require('gulp'),
    gutil = require('gulp-util'),
    sourcemaps = require('gulp-sourcemaps'),
    uglify = require('gulp-uglify'),
    sass = require('gulp-sass'),
    concat = require('gulp-concat');

var config = {
    paths: {
        public: './public/scripts',
        client: './client',
        js: ['./client/scripts/main.js','./client/**/*.js'],
        server: './server',
        sass: './client/sass/*.scss',
        css: './public/stylesheets'
    }
};

gulp.task('default', ['sass', 'javascript','watch','sass:watch'],
    function(){
        gutil.log('Gulped!');
    });

gulp.task('sass', function () {
     gulp.src(config.paths.sass)
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest(config.paths.css));
});

gulp.task('javascript', function(){
    gulp.src(config.paths.js)
        .pipe(sourcemaps.init())
        .pipe(concat('app.js'))
        .pipe(uglify())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(config.paths.public))
});

gulp.task('watch', function() {
    gulp.watch(config.paths.js, ['javascript'])
});

gulp.task('sass:watch', function() {
    gulp.watch(config.paths.sass, ['sass'])
});




//gulp.task('sass:watch', function() {
//   gulp.watch(config.paths.sass, ['sass'])
//});