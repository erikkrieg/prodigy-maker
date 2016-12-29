'use strict';

var gulp = require('gulp');
var concat = require('gulp-concat');
var sass = require('gulp-sass');
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');
var util = require('gulp-util');
var gulpif = require('gulp-if');
var browserSync = require('browser-sync').create();

var PATHS = {
    BLOCKLY_JS: [
        'src/js/vendor/blockly/blockly_compressed.js',
        'src/js/vendor/blockly/blocks_compressed.js',
        'src/js/vendor/blockly/javascript_compressed.js',
        'src/js/vendor/blockly/msg/js/en.js'
    ],
    JS: [
        'node_modules/lodash/lodash.js',
        'node_modules/phaser/build/phaser.js',
        'src/js/custom-blocks/**/*.js',
        'src/js/workspace/**/*.js',
        'src/js/game/states/*.js',
        'src/js/game/*.js',
        'src/js/game-modal/*.js',
        'src/js/entry.js'
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

gulp.task('js', ['js-blockly', 'js-app']);

gulp.task('scss', function () {
    return gulp.src(PATHS.SCSS)
        .pipe(gulpif(config.sourceMaps, sourcemaps.init()))
        .pipe(sass(config.sass))
        .pipe(gulpif(config.sourceMaps, sourcemaps.write('.')))
        .pipe(gulp.dest('dist/css'))
        .pipe(browserSync.stream());
});

gulp.task('fonts', function() {
  return gulp.src('node_modules/font-awesome/fonts/*')
    .pipe(gulp.dest('dist/fonts'));
})

gulp.task('watch', function () {
    gulp.watch(PATHS.JS, ['js-app']);
    gulp.watch(PATHS.SCSS, ['scss']);
});

gulp.task('browser-sync', function () {
    var path = './dist/';
    browserSync.init({
        server: {
            baseDir: path,
        },
    });
    gulp.watch(path + '*.html').on('change', browserSync.reload);
});

gulp.task('default', ['fonts', 'js', 'scss', 'watch']);

gulp.task('sync', ['default', 'browser-sync']);
