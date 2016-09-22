"use strict";
var gulp         = require('gulp'),
    browserSync  = require('browser-sync'),
    sass         = require('gulp-sass'),
    jade         = require('gulp-jade'),
    series       = require('stream-series'),
    imagemin     = require('gulp-imagemin'),
    uglify       = require('gulp-uglify'),
    pump         = require('pump'),
    sourcemaps   = require('gulp-sourcemaps'),
    autoprefixer = require('gulp-autoprefixer'),
    cleancss     = require('gulp-clean-css'),
    concat       = require('gulp-concat'),
    rename       = require('gulp-rename'),
    eslint       = require('gulp-eslint'),
    plumber      = require('gulp-plumber'),
    gutil        = require('gulp-util'),
    bourbon      = require('node-bourbon').includePaths,
    reload       = browserSync.reload;

/**
 * Compile jade files into HTML
 */
gulp.task('templates', function() {

    return gulp.src('app/jade/*.jade')
        .pipe(plumber())
        .pipe(jade({
            pretty: true
        }).on('error', gutil.log))
        .pipe(gulp.dest('dist/'));
});

gulp.task('jade-watch', ['templates'], reload);

/**
 * Compile sass file into CSS
 */
var sassOptions = {
    errLogToConsole : true,
    outputStyle : 'expanded',
    includePaths : ['../sass/'].concat(bourbon),
};

gulp.task('sass', function () {
    return gulp.src('app/sass/style.scss')
        .pipe(plumber())
        .pipe(sourcemaps.init())
        .pipe(sass(sassOptions).on('error', sass.logError, gutil.log))
        .pipe(autoprefixer())
        .pipe(sourcemaps.write('../maps'))
        .pipe(gulp.dest('app/css/'))
        .pipe(reload({stream: true}));
});

/**
 * css minify
 */
gulp.task('cssmin', function() {
   return gulp.src('app/css/**/*.css') 
        .pipe(sourcemaps.init())
        .pipe(cleancss({compatibility: 'ie8'}))
        .pipe(sourcemaps.write('../maps'))
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest('dist/css'))
        .pipe(reload({stream: true}));
});


/**
 * Minify image file
 */

 gulp.task('imagemin',function(){
    return gulp.src('app/img/*')
                .pipe(plumber())
                .pipe(imagemin())
                .pipe(gulp.dest('dist/img'));
});


/**
 * Minify js file with uglify
 */

gulp.task('jsmin', function(cb){
    pump([
        gulp.src(['app/js/**/*.js', '!app/js/custom/**']),
            uglify(),
            rename({
                suffix: '.min'
                }),
            gulp.dest('dist/js')
        ], cb
        );
});


/**
 * Concatinating javascript files
 */

gulp.task('jsjoin', function(){
    return gulp.src('app/js/custom/*.js')
        .pipe(plumber())
        .pipe(sourcemaps.init())
        //  .pipe(useref()) // it helps to concatenate files from different directories
        .pipe(concat('main.js').on('error', gutil.log))
        .pipe(sourcemaps.write('../maps'))
        .pipe(gulp.dest('app/js'))
        .pipe(reload({stream: true}));
});

/**
 * Ecmascript Linter
 */

gulp.task('es', function(){
    return gulp.src(['app/js/custom/**/*.js', '!node_modules/**'])
            .pipe(plumber())
            .pipe(eslint().on('error', gutil.log))
            .pipe(eslint.format())
            .pipe(eslint.failAfterError())
            .pipe(reload({stream: true}));
});

/**
 * Calling all the task all together
 */
gulp.task('do', ['sass', 'jade-watch', 'cssmin', 'jsmin', 'jsjoin'], function () {

    browserSync({server: 'dist'});

    gulp.watch('./app/sass/**/*.scss', ['sass']);
    gulp.watch('./app/css/**/*.css', ['cssmin']);
    gulp.watch('./app/js/custom/*.js', ['jsjoin']);
    gulp.watch('./app/jade/**/*.jade', ['jade-watch']);

});
