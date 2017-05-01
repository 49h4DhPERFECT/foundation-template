var gulp = require('gulp');
var del = require('del');
var plumber = require('gulp-plumber');
var browserSync = require('browser-sync').create();
// HTML
var panini = require('panini');
// Images
var image = require('gulp-image');
// SASS - CSS
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var autoprefixer = require('gulp-autoprefixer');
var cleanCSS = require('gulp-clean-css');
var uncss = require('gulp-uncss');
// JS
var concat = require('gulp-concat');
var babel = require('gulp-babel');
var uglify = require('gulp-uglify');

// Variables
var browsers = ['last 2 versions', 'ie >= 9', 'ios >= 7'];
var includePaths = [
    'node_modules/foundation-sites/scss'
    // 'node_modules/motion-ui/src'
];
var jsConcat = [
    'node_modules/foundation-sites/vendor/jquery/dist/jquery.min.js',
    // 'node_modules/foundation-sites/js/foundation.core.js',
    // 'node_modules/foundation-sites/js/foundation.util.mediaQuery.js',
    // 'node_modules/foundation-sites/js/foundation.util.timerAndImageLoader.js',
    // 'node_modules/foundation-sites/js/foundation.equalizer.js',
    'src/js/project.js'
];

// Tasks
gulp.task('scss', function () {
    return gulp.src('src/scss/*.scss')
        .pipe(plumber({
            errorHandler: function (error) {
                console.log(error);
                this.emit('end');
            }
        }))
        .pipe(sourcemaps.init())
        .pipe(sass({includePaths: includePaths, outputStyle: 'expanded'}))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('build/css'))
        .pipe(plumber.stop())
        .pipe(browserSync.stream())
});

gulp.task('scss_build', function () {
    return gulp.src('src/scss/*.scss')
        .pipe(plumber({
            errorHandler: function (error) {
                console.log(error);
                this.emit('end');
            }
        }))
        .pipe(sass({includePaths: includePaths, outputStyle: 'compressed'}))
        .pipe(autoprefixer({
            browsers: browsers
        }))
        // .pipe(uncss({
        //     html: ['build/*.html'],
        //     ignore: [
        //         new RegExp('^\.is-.*')
        //     ]
        // }))
        .pipe(cleanCSS({compatibility: '*'}))
        .pipe(gulp.dest('build/css'))
        .pipe(plumber.stop());
});

gulp.task('html',function () {
    panini.refresh();
    gulp.src('src/html/pages/**/*.html')
        .pipe(panini({
            root: 'src/html/pages/',
            layouts: 'src/html/layouts/',
            partials: 'src/html/partials/',
            data: 'src/html/data/',
            helpers: 'src/html/helpers/'
        }))
        .pipe(gulp.dest('build'))
        .pipe(browserSync.stream())
});

gulp.task('fonts', function () {
    gulp.src('src/fonts/**')
        .pipe(gulp.dest('build/fonts'))
        .pipe(browserSync.stream())
});

gulp.task('js', function () {
    return gulp.src(jsConcat)
        .pipe(plumber({
            errorHandler: function (error) {
                console.log(error);
                this.emit('end');
            }
        }))
        .pipe(sourcemaps.init())
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(concat('app.js'))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('build/js/'))
        .pipe(plumber.stop())
        .pipe(browserSync.stream())
});

gulp.task('js_build', function () {
    return gulp.src(jsConcat)
        .pipe(plumber({
            errorHandler: function (error) {
                console.log(error);
                this.emit('end');
            }
        }))
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(concat('app.js'))
        .pipe(uglify())
        .pipe(gulp.dest('build/js/'))
        .pipe(plumber.stop())
});

gulp.task('images', function () {
    gulp.src('src/images/*')
        .pipe(plumber({
            errorHandler: function (error) {
                console.log(error);
                this.emit('end');
            }
        }))
        .pipe(gulp.dest('build/images/'))
        .pipe(browserSync.stream())
        .pipe(plumber.stop())
});

gulp.task('images_build', function () {
    gulp.src('src/images/*')
        .pipe(plumber({
            errorHandler: function (error) {
                console.log(error);
                this.emit('end');
            }
        }))
        .pipe(image({
            pngquant: true,
            optipng: true,
            zopflipng: false,
            jpegRecompress: false,
            jpegoptim: true,
            mozjpeg: true,
            gifsicle: true,
            svgo: true,
            concurrent: 10
        }))
        .pipe(gulp.dest('build/images/'))
        .pipe(plumber.stop())
});

//Clean
gulp.task('clean', function () {
    del.sync(['build/**', '!build']);
});

//browser-sync
gulp.task('browser-sync', function () {
    browserSync.init({
        server: {
            baseDir: "build/"
        },
        notify: false
    });
    gulp.watch('src/scss/**/*.scss', ['scss']);
    gulp.watch('src/html/**/*.html', ['html']);
    gulp.watch('src/js/*.js', ['js']);
    gulp.watch('src/images/*', ['images']);
    gulp.watch('src/fonts/*', ['fonts']);
});

//Compile
gulp.task('compile', ['clean', 'html', 'fonts', 'images', 'js', 'scss']);

//Build
gulp.task('build', ['clean', 'html', 'fonts', 'images_build', 'js_build', 'scss_build']);

//Default
gulp.task('default', ['compile', 'browser-sync']);
