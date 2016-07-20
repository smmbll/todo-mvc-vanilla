/**
 * Dependencies
 */

var gulp = require('gulp');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var useref = require('gulp-useref');
var uglify = require('gulp-uglify');
var gulpIf = require('gulp-if');
var cssnano = require('gulp-cssnano');
var jslint = require('gulp-jslint');
var lazypipe = require('lazypipe');
var browserSync = require('browser-sync');

/**
 * Development Tasks
 */

// Start browserSync server
gulp.task('browserSync', function() {
  browserSync({
    open: false,
    server: {
      baseDir: './app',
      routes: {
        "/bower_components": "./bower_components"
      }
    }
  })
})

gulp.task('sass', function() {
  gulp.src('app/assets/styles/scss/**/*.scss')
    .pipe(sass({
      includePaths: [
        './bower_components/bootstrap/scss',
        './bower_components/components-font-awesome/scss'
      ]
    }).on('error',sass.logError))
    .pipe(gulp.dest('app/assets/styles/css/'))
    .pipe(browserSync.reload({
      stream: true
    }));
})

gulp.task('js', function() {
  gulp.src('app/assets/scripts/**/*.js')
    //.pipe(jslint())
    //.pipe(jslint.reporter('stylish'))
    .pipe(browserSync.reload({
      stream: true
    }));
});

// Get font-awesome icons out of bower and into fonts
gulp.task('icons', function() { 
    gulp.src('./bower_components/components-font-awesome/fonts/**.*') 
        .pipe(gulp.dest('./app/assets/styles/fonts')); 
});

// Watchers
gulp.task('watch', function() {
  gulp.watch('app/assets/styles/scss/**/*.scss',['sass']);
  gulp.watch('app/*.html',browserSync.reload);
  gulp.watch('app/assets/scripts/**/*.js',['js']);
});

gulp.task('default', ['icons','sass','js','browserSync','watch']);

/**
 * Production Tasks
 */

// Optimizing CSS and JavaScript
gulp.task('useref', function() {
  // For running sequential tasks in gulp-if
  var pipeline = lazypipe()
    .pipe(autoprefixer, { browsers: ['last 2 versions'] })
    .pipe(cssnano);

  gulp.src('app/*.html')
    .pipe(useref())
    .pipe(gulpIf('*.js', uglify()))
    .pipe(gulpIf('*.css', pipeline()))
    .pipe(gulp.dest('dist'));
});

// Build
gulp.task('build', ['icons','sass','useref']);
