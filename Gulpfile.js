var gulp = require('gulp');
//styes
var sass = require('gulp-sass');
var notify = require("gulp-notify");
var cssnano = require('gulp-cssnano');
var rename = require("gulp-rename");
var autoprefixer = require('gulp-autoprefixer');

//javascript
var jshint = require('gulp-jshint');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var pump = require('pump');
var babel = require('gulp-babel');

//images
var cache = require('gulp-cache');
var imagemin = require('gulp-imagemin');

//other
var clean = require('gulp-clean');
var htmlmin = require('gulp-htmlmin');


//---------------------------------------------------------------------

//styles
//sass
gulp.task('sass', function() {
    return gulp.src('./css/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('./css'))
        .pipe(notify("sass Gulp!"));
});
//min css
gulp.task('min', function() {
    return gulp.src('./css/*.css')
        .pipe(cssnano())
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest('dist'));
});

//full styles
gulp.task('styles', function() {
    return gulp.src('./css/style.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe(gulp.dest('./css'))
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(cssnano())
        .pipe(gulp.dest('./css'))
        .pipe(notify({
            message: 'Styles task complete'
        }));
});

//javascript
// lint
gulp.task('lint', function() {
    return gulp.src('./js/*.js')
        .pipe(jshint())
        // .pipe(gulp.dest('./dist'))
        .pipe(jshint.reporter('default'));
});
//concat
gulp.task('concat', function() {
    return gulp.src('./js/*.js')
        .pipe(concat('all.js'))
        .pipe(gulp.dest('./dist/'));
});
//uglify
gulp.task('ugly', function(cb) {
    pump([
            gulp.src('./js/*.js')
            .pipe(rename({
                suffix: '.min'
            })),
            uglify(),
            gulp.dest('dist')
        ],
        cb
    );
});
//Babel
gulp.task('babel', function() {
    gulp.src('js/*.js')
        .pipe(babel({
            presets: ['env']
        }))
        .pipe(gulp.dest('dist'));
});

//full scripts
gulp.task('scripts', function() {
    return gulp.src('./js/main.js')

        // .pipe(jshint())
        // .pipe(jshint.reporter('default'))
        .pipe(babel({
            presets: ['env']
        }))
        // .pipe(concat('all.js'))
        // .pipe(gulp.dest('./js/'))
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(uglify())
        .pipe(gulp.dest('./js'))
        .pipe(notify({
            message: 'Scripts task complete'
        }));
});

//build
gulp.task('build', ['clean'], function() {
    gulp.start('minhtml', 'styles', 'scripts');
});

//clean
gulp.task('clean', function() {
    return gulp.src('./dist', {
            read: false
        })
        .pipe(clean());
});
//htmlmin
gulp.task('minhtml', function() {
    return gulp.src('index_src.html')
        .pipe(htmlmin({
            collapseWhitespace: true
        }))
        .pipe(rename('index.html'))
        .pipe(gulp.dest('./'));
});
//watch - developers
gulp.task('watch', function() {
    gulp.watch('./css/*.scss', ['sass-dev']);
    gulp.watch('./js/*.js', ['scripts-dev']);
});
gulp.task('sass-dev', function() {
    return gulp.src('./css/style.scss')
        .pipe(sass().on('error', sass.logError))

        .pipe(rename({
            suffix: '.min'
        }))
        // .pipe(cssnano())
        .pipe(gulp.dest('./css'));
});
gulp.task('scripts-dev', function() {
    return gulp.src('./js/main.js')
        // .pipe(concat('all.js'))
        // .pipe(gulp.dest('./dist'))
        // .pipe(babel({
        // 	presets: ['env']
        //  }))
        .pipe(rename({
            suffix: '.min'
        }))
        // .pipe(uglify())
        .pipe(gulp.dest('./js'));
});