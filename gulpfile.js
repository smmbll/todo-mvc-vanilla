/**
 * Dependencies
 */

var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var stylish = require('jshint-stylish');
var lazypipe = require('lazypipe');
var browserSync = require('browser-sync');
var exec = require('child_process').exec;
var del = require('del');

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
 * Setup tasks
 */

// Install bower modules
gulp.task('bower', runCommand.bind(null,'bower install'));

// Get font-awesome icons out of bower and into fonts
gulp.task('icons', function() { 
    gulp.src(paths.bower + '/components-font-awesome/fonts/**.*') 
        .pipe(gulp.dest(paths.src + '/assets/fonts')); 
});

// Set environment variables
gulp.task('env:dev', function() {
  process.env.production = false;
});

gulp.task('setup',['bower','env:dev','icons']);

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
  });
});

// Compile sass with sourcemaps
gulp.task('sass', function() {
  gulp.src(paths.src + paths.styles + '/scss/**/*.scss')
    .pipe($.sourcemaps.init())
    .pipe($.sass({
      includePaths: [
        paths.bower + '/bootstrap/scss',
        paths.bower + '/components-font-awesome/scss'
      ]
    }).on('error',$.sass.logError))
    .pipe($.sourcemaps.write())
    .pipe(gulp.dest(paths.src + paths.styles + '/css/'))
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

gulp.task('dev', ['icons','sass','js','browserSync','watch']);

/**
 * Production Tasks
 */

// Delete old dist files
gulp.task('clean', function (cb) {
   del(paths.dest, cb);
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

// Set environment variable
gulp.task('env:prod',function() {
  process.env.production = true;
});

// Build
gulp.task('build', ['env:prod','icons:dist','sass','useref']);

/**
 * App tasks
 */
gulp.task('start-mongo', runCommand.bind(null,'mongod'));
gulp.task('stop-mongo', runCommand.bind(null,'mongo --eval "use admin; db.shutdownServer();"'));
gulp.task('deploy', ['start-mongo'], runCommand.bind(null,'nodemon server.js'));
