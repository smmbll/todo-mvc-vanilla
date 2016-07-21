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
 * Configuration
 */

var config = require('./config').gulp;
var paths = config.paths;

/**
 * Development Tasks
 */

// Start browserSync server
gulp.task('browserSync', function() {
  browserSync({
    open: false,
    server: {
      baseDir: './' + paths.src,
      routes: {
        '/bower_components' : paths.bower
      }
    }
  })
})

gulp.task('sass', function() {
  gulp.src(paths.src + paths.styles + '/scss/**/*.scss')
    .pipe(sass({
      includePaths: [
        paths.bower + '/bootstrap/scss',
        paths.bower + '/components-font-awesome/scss'
      ]
    }).on('error',sass.logError))
    .pipe(gulp.dest(paths.src + paths.styles + '/css/'))
    .pipe(browserSync.reload({
      stream: true
    }));
})

gulp.task('js', function() {
  gulp.src(paths.src + paths.scripts + '/**/*.js')
    //.pipe(jslint())
    //.pipe(jslint.reporter('stylish'))
    .pipe(browserSync.reload({
      stream: true
    }));
});

// Get font-awesome icons out of bower and into fonts
gulp.task('icons', function() { 
    gulp.src(paths.bower + '/components-font-awesome/fonts/**.*') 
        .pipe(gulp.dest(paths.src + paths.styles + '/fonts')); 
});

// Watchers
gulp.task('watch', function() {
  gulp.watch(paths.src + paths.styles + '/scss/**/*.scss',['sass']);
  gulp.watch(paths.src + '/*.html',browserSync.reload);
  gulp.watch(paths.src + paths.scripts + '/**/*.js',['js']);
});

gulp.task('default', ['icons','sass','js','browserSync','watch']);

/**
 * Production Tasks
 */

// Optimizing CSS and JavaScript
gulp.task('useref', function() {
  // For running sequential tasks in gulp-if
  var pipeline = lazypipe()
    .pipe(autoprefixer, config.autoprefixer)
    .pipe(cssnano);

  gulp.src(paths.src + '/*.html')
    .pipe(useref())
    .pipe(gulpIf('*.js', uglify()))
    .pipe(gulpIf('*.css', pipeline()))
    .pipe(gulp.dest(paths.dist));
});

// Build
gulp.task('build', ['icons','sass','useref']);
