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
var jshint = require('gulp-jshint');
var stylish = require('jshint-stylish');
var size = require('gulp-size');
var lazypipe = require('lazypipe');
var browserSync = require('browser-sync');
var exec = require('child_process').exec;

/**
 * Configuration
 */

var config = require('./config').gulp;
var paths = config.paths;

/**
 * Utility functions
 */
var runCommand = function(command) {
 exec(command, function (err, stdout, stderr) {
   console.log(stdout);
   console.log(stderr);
   if (err !== null) {
     console.log('exec error: ' + err);
   }
 });
}

/**
 * Setup tasks -- install bower and npm modules
 */
gulp.task('bower', runCommand.bind(null,'bower install'));
gulp.task('npm', runCommand.bind(null,'npm install'));
// Get font-awesome icons out of bower and into fonts
gulp.task('icons', function() { 
    gulp.src(paths.bower + '/components-font-awesome/fonts/**.*') 
        .pipe(gulp.dest(paths.src + paths.styles + '/fonts')); 
});
gulp.task('setup',['npm','bower','icons']);

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
    .pipe(jshint())
    .pipe(jshint.reporter(stylish))
    .pipe(browserSync.reload({
      stream: true
    }));
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
gulp.task('icons:dist', function() { 
   gulp.src(paths.bower + '/components-font-awesome/fonts/**.*') 
       .pipe(gulp.dest(paths.dest + '/assets/fonts')); 
});

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
    .pipe(size())
    .pipe(gulp.dest(paths.dest));
});

// Build
gulp.task('build', ['icons:dist','sass','useref']);

/**
 * App tasks
 */
gulp.task('start-mongo', runCommand.bind(null,'mongod'));
gulp.task('stop-mongo', runCommand.bind(null,'mongo --eval "use admin; db.shutdownServer();"'));
gulp.task('start-app', ['start-mongo'], runCommand.bind(null,'nodemon server.js'));
