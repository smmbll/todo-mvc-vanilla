var config = {};

config.gulp = {};

config.server = {};

/**
 * Gulp config
 */

var gulp = config.gulp;

gulp.paths = {
    src: 'src',
    dest: 'dist',
    bower: 'bower_components',
    styles: '/assets/styles',
    scripts: '/assets/scripts'
};

gulp.autoprefixer = ['last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'];

/**
 * Server config
 */

var server = config.server;

module.exports = config;
