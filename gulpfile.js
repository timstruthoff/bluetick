var gulp = require('gulp');


//CSS
var autoprefixer = require('gulp-autoprefixer');
var csscomb = require('gulp-csscomb');//Orders properties
var cssimport = require("gulp-cssimport");//Inline imports
var cssnano = require('gulp-cssnano');//Minifie

//JS
var uglify = require('gulp-uglify');

//General
var insert = require('gulp-insert');
var ext_replace = require('gulp-ext-replace');


gulp.task('css', function () {
    return gulp.src('frontend/css/styles.css')
        .pipe(autoprefixer({
            browsers: ['>1%']
        }))
        .pipe(cssimport())
        .pipe(csscomb())
        .pipe(cssnano())
        .pipe(insert.prepend(`/*\r\n┌─────┐\r\n│ T M │ © ${new Date().getFullYear()} - Tim Struthoff\r\n│ S T │ \r\n└─────┘\r\n*/\r\n`))
        .pipe(ext_replace('.min.css'))
        .pipe(gulp.dest('assets'));
});

gulp.task('js', function () {
    return gulp.src('frontend/script.js')
        .pipe(uglify())
        .pipe(insert.prepend(`/*\r\n┌─────┐\r\n│ T M │ © ${new Date().getFullYear()} - Tim Struthoff\r\n│ S T │ \r\n└─────┘\r\n*/\r\n`))
        .pipe(ext_replace('.min.js'))
        .pipe(gulp.dest('assets'));
    
});


gulp.task('default', ['css', 'js']);
