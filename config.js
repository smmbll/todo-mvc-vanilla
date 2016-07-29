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

gulp.stores = {
  static: 'store-static.js',
  dynamic: 'store-dynamic.js'
};

gulp.autoprefixer = ['last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'];

gulp.vendorFiles = [
  gulp.paths.bower + '/fetch/fetch.js',
  gulp.paths.bower + '/es6-promise/promise.js'
];

/**
 * Server config
 */

var server = config.server;

server.port = 3000;
server.path = process.env.NODE_ENV === 'production' ? 'dist' : 'src';

module.exports = config;
