var gulp = require('gulp');
var panini = require('panini');
var del = require('del');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var concat = require('gulp-concat');
var babel = require('gulp-babel');
var uglify = require('gulp-uglify');
var cache = require('gulp-cache');
var image = require('gulp-image');
var livereload = require('gulp-livereload');
var connect = require('gulp-connect');

var browsers = ['last 2 versions', 'ie >= 9', 'and_chr >= 2.3'];

var jsConcat = [
    'node_modules/foundation-sites/vendor/jquery/dist/jquery.min.js',
    // 'node_modules/foundation-sites/js/foundation.core.js',
    // 'node_modules/foundation-sites/js/foundation.util.mediaQuery.js',
    // 'node_modules/foundation-sites/js/foundation.util.timerAndImageLoader.js',
    // 'node_modules/foundation-sites/js/foundation.equalizer.js',
    'assets/js/project.js'
];

gulp.task('scss', function () {
    return gulp.src('assets/scss/*.scss')
        .pipe(sass({includePaths: ['node_modules/foundation-sites/scss/'], outputStyle: 'extended'}).on('error', sass.logError))
        .pipe(gulp.dest('assets/css'))
        .pipe(connect.reload());
});

gulp.task('scss_build', function () {
    return gulp.src('assets/scss/*.scss')
        .pipe(sass({includePaths: ['node_modules/foundation-sites/scss/'], outputStyle: 'compressed'}).on('error', sass.logError))
        .pipe(gulp.dest('assets/css'))
        .pipe(connect.reload());
});

gulp.task('css', function(){
    gulp.src('assets/css/*.css')
        .pipe(autoprefixer({
            browsers: browsers
        }))
        .pipe(gulp.dest('public/css/'))
        .pipe(connect.reload());
});

gulp.task('html',function () {
    panini.refresh();
    gulp.src('assets/html/pages/*.html')
        .pipe(panini({
            root: 'assets/html/pages/',
            layouts: 'assets/html/layouts/',
            partials: 'assets/html/partials/',
            data: 'assets/html/data/',
            helpers: 'assets/html/helpers/'
        }))
        .pipe(gulp.dest('public/'))
        .pipe(connect.reload());
});

gulp.task('fonts', function () {
   gulp.src('assets/fonts/*')
       .pipe(gulp.dest('public/fonts/'))
       .pipe(connect.reload());
});

gulp.task('js', function () {
    return gulp.src(jsConcat)
        .pipe(concat('app.js'))
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(uglify())
        .pipe(gulp.dest('public/js/'))
        .pipe(connect.reload());
});

gulp.task('images', function () {
    gulp.src('assets/images/*')
        .pipe(cache(image({
            pngquant: true,
            optipng: true,
            zopflipng: true,
            jpegRecompress: false,
            jpegoptim: true,
            mozjpeg: true,
            gifsicle: true,
            svgo: true,
            concurrent: 10
        })))
        .pipe(gulp.dest('public/images/'))
        .pipe(connect.reload());
});

//Clean
gulp.task('clean', function () {
    del.sync(['public/**', '!public']);
});

//Connect
gulp.task('connect', function () {
    connect.server({
        root: 'public',
        livereload: true
    });
});

//Watch
gulp.task('watch', function () {
    gulp.watch('assets/scss/*.scss', ['scss']);
    gulp.watch('assets/css/*.css', ['css']);
    gulp.watch('assets/html/**/*.html', ['html']);
    gulp.watch('assets/js/*.js', ['js']);
    gulp.watch('assets/images/*', ['images']);
});

//Default
gulp.task('default', ['compile', 'connect', 'watch']);

//Compile
gulp.task('compile', ['clean', 'scss', 'css', 'fonts', 'js', 'images', 'html']);

//Build
gulp.task('build', ['clean', 'scss_build', 'css', 'fonts', 'js', 'images', 'html']);
