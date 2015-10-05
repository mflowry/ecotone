'use strict';

// dependencies
var gulp = require('gulp'),
    gutil = require('gulp-util'),
    sourcemaps = require('gulp-sourcemaps'),
    uglify = require('gulp-uglify'),
    sass = require('gulp-sass'),
    source = require('vinyl-source-stream'),
    lint = require('gulp-eslint');


var config = {
    transforms: [babelify, reactify],
    paths: {
        client: './client',
        js: './client/**/*.js',
        server: './server',
        sass: './client/sass/*.scss'
    }
};

gulp.task('default', [ 'js', 'sass', 'lint'],
    function(){
        gutil.log('Gulped!');
    });

gulp.task('js', function() {
     browserify(config.paths.mainJs)
        .transform(config.transforms)
        .bundle()
        .on('error', console.error.bind(console))
        .pipe(source('bundle.js'))
        .pipe(gulp.dest(config.paths.dist + '/public/assets/scripts'));
});


gulp.task('lint', function() {
    return gulp.src(config.paths.js)
        .pipe(lint({config: 'eslint.config.json'}))
        .pipe(lint.format());
});

gulp.task('sass', function () {
     gulp.src('./src/sass/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest(config.paths.dist + '/public/assets/styles'));
});


gulp.task('watch', function() {
    gulp.watch(config.paths.js, ['js', 'lint'])
});

gulp.task('sass:watch', function() {
   gulp.watch(config.paths.sass, ['sass'])
})
