'use strict';

var gulp = require('gulp');
var concat = require('gulp-concat');
var sass = require('gulp-sass');
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');
var util = require('gulp-util');
var gulpif = require('gulp-if');

var PATHS = {
    BLOCKLY_JS: [
        'src/js/vendor/blockly/blockly_compressed.js',
        'src/js/vendor/blockly/blocks_compressed.js',
        'src/js/vendor/blockly/msg/js/en.js'
    ],
    JS: [
        'node_modules/lodash/lodash.js',
        'node_modules/phaser/build/phaser.js',
        'src/js/game/states/*.js',
        'src/js/game/*.js'
    ],
    SCSS: [
        'src/scss/**/*.scss'
    ]
};

var config = {
    sourceMaps: !util.env.production,
    uglify: util.env.production,
    sass: {
        outputStyle: util.env.production ? 'compressed' : 'nested'
    }
};


gulp.task('watch', ['default', 'watch-files']);

gulp.task('watch-files', function () {
    gulp.watch('src/js/**/*.js', ['default']);
});

gulp.task('default', ['js', 'scss']);

gulp.task('js', ['js-blockly', 'js-app']);

// These files are very large and already compressed,
// so they have been seperated from the js-app task.
gulp.task('js-blockly', function () {
    return gulp.src(PATHS.BLOCKLY_JS)
        .pipe(concat('blockly.js'))
        .pipe(gulp.dest('dist'));
});

gulp.task('js-app', function () {
    return gulp.src(PATHS.JS)
        .pipe(concat('app.js'))
        .pipe(gulpif(config.uglify, uglify()))
        .pipe(gulp.dest('dist'));
});

gulp.task('scss', function () {
    return gulp.src(PATHS.SCSS)
        .pipe(gulpif(config.sourceMaps, sourcemaps.init()))
        .pipe(sass(config.sass))
        .pipe(gulpif(config.sourceMaps, sourcemaps.write('.')))
        .pipe(gulp.dest('dist'))
});
