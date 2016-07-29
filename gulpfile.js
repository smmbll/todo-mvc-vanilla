/**
 * Dependencies
 */

var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var os = require('os');
var stylish = require('jshint-stylish');
var lazypipe = require('lazypipe');
var runSequence = require('run-sequence');
var browserSync = require('browser-sync');
var exec = require('child_process').exec;
var del = require('del');

/**
 * Configuration
 */

var config = require('./config').gulp;
var paths = config.paths;
var browser = os.platform() === 'linux' ? 'google-chrome' : (
  os.platform() === 'darwin' ? 'google chrome' : (
  os.platform() === 'win32' ? 'chrome' : 'firefox'));

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
 * Setup tasks
 */

// Install bower modules
gulp.task('bower', function() {
  return $.bower();
});

// Get font-awesome icons out of bower and into fonts
gulp.task('icons', function() { 
    gulp.src(paths.bower + '/components-font-awesome/fonts/**.*') 
        .pipe(gulp.dest(paths.src + '/assets/fonts')); 
});

// Move vendor files
gulp.task('vendor', function() {
  gulp.src(config.vendorFiles)
    .pipe(gulp.dest(paths.src + '/assets/scripts/vendor'))
});

gulp.task('setup',function() {
  runSequence('bower',['icons','vendor']);
});

/**
 * Development Tasks
 */

// Start browserSync server
gulp.task('browser-sync', function() {
  browserSync.init(null, {
    proxy: "http://localhost:3000",
    browser: [browser],
    port: 7000
  });
});

// Compile sass with sourcemaps
gulp.task('sass', function() {
  gulp.src(paths.src + paths.styles + '/*.scss')
    .pipe($.sourcemaps.init())
    .pipe($.sass({
      includePaths: [
        paths.bower + '/bootstrap/scss',
        paths.bower + '/components-font-awesome/scss'
      ]
    }).on('error',$.sass.logError))
    .pipe($.sourcemaps.write())
    .pipe(gulp.dest(paths.src + paths.styles))
    .pipe(browserSync.reload({
      stream: true
    }));
});

// Reload JS
gulp.task('js', function() {
  gulp.src(paths.src + paths.scripts + '/**/*.js')
    .pipe($.jshint())
    .pipe($.jshint.reporter(stylish))
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

// Dev task
gulp.task('dev', function() {
  runSequence(['sass','js'],'start-mongo','nodemon','browser-sync','watch');
});

/**
 * Production Tasks
 */

// Delete old dist files
gulp.task('clean', function () {
   del(paths.dest);
});

// Move font-awesome icons to prod fonts
gulp.task('icons:dist', function() { 
   gulp.src(paths.bower + '/components-font-awesome/fonts/**.*') 
       .pipe(gulp.dest(paths.dest + '/assets/fonts')); 
});

// Optimizing CSS and JavaScript
gulp.task('useref', function() {
  // For running sequential tasks in gulp-if
  var mapsPipeline = lazypipe()
    .pipe($.sourcemaps.init, {loadMaps: true});
  var cssPipeline = lazypipe()
    .pipe($.autoprefixer, config.autoprefixer)
    .pipe($.cssnano);

  gulp.src(paths.src + '/*.html')
    .pipe($.useref({},mapsPipeline))
    .pipe($.if('*.js',$.uglify(),$.sourcemaps.write()))
    .pipe($.if('*.css',cssPipeline()))
    .pipe($.size())
    .pipe(gulp.dest(paths.dest));
});

// Build
gulp.task('build', ['icons:dist','sass','useref']);

/**
 * Server tasks
 */
gulp.task('start-mongo', runCommand.bind(null,'mongod'));

gulp.task('stop-mongo', runCommand.bind(null,'mongo --eval "use admin; db.shutdownServer();"'));

gulp.task('nodemon', function() {
  $.nodemon({
    script: 'server.js',
    ext: 'js html',
    env: { 'NODE_ENV': process.argv[process.argv.length - 1] }
  });
});

gulp.task('open',function() {
  var options = {
    uri: 'localhost:3000',
    app: browser
  };

  gulp.src(__filename)
    .pipe($.open(options));
});

gulp.task('deploy', function() {
  runSequence('start-mongo','nodemon','open');
});
