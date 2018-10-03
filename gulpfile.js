var gulp = require('gulp'),
    bower = require('gulp-bower'),
    rimraf = require('rimraf'),
    serve = require('gulp-serve'),
    concat = require('gulp-concat'),
    less = require('gulp-less'),
    minifyCss = require('gulp-minify-css'),
    uglify = require('gulp-uglify'),
    replace = require('gulp-replace'),
    uuidv4 = require('uuid/v4'),
    htmlmin = require('gulp-htmlmin'),
    browserSync = require('browser-sync').create();
var uuid = uuidv4().replace(/-/g, '');
var paths = {
    bower: ['./bower_components/**'],
    index: ['./app/html/index.html'],
    less: ['./app/less/main.less'],
    js: ['./app/js/**/*.js'],
    pages: ['./app/html/pages/**/*.html'],
    bootstrap: {
      scss: ['node_modules/bootstrap/scss/bootstrap.scss', 'src/scss/**/*.scss'],
      js: ['node_modules/bootstrap/dist/js/bootstrap.js', 'src/js/**/*.js'],
    },
    dist: {
      www: './www/',
      pages: './www/html/',
      css: './www/css/',
      lessdebug: './lessdebug/',
      js: './www/js/',
      lib: './www/lib/',
    },
  }

gulp.task('install', function() {
  bower_install();
  less_install();
  js_install();
  pages_install();
  replace_uuid();
});

gulp.task('clean', function() {
  bower_clean();
  less_clean();
  js_clean();
  pages_clean();
});

gulp.task('lessdebug', function() {
  gulp.src(paths.less)
  .pipe(less())
  .pipe(gulp.dest(paths.dist.lessdebug))
});

function bower_install() {
  bower()
  .pipe(gulp.dest(paths.dist.lib));
}
function bower_clean() {
  rimraf('./bower_components', function() {
    rimraf(paths.dist.lib, function() {});
  });
}

function less_install() {
  gulp.src(paths.less)
  .pipe(less())
  .pipe(concat(uuid+'.css'))
  .pipe(minifyCss())
  .pipe(gulp.dest(paths.dist.css))
  .pipe(browserSync.stream());
}
function less_clean() {
  rimraf(paths.dist.css, function() {});
}

function js_install() {
  gulp.src(paths.js)
    .pipe(concat(uuid+'.js'))
    .pipe(uglify())
    .pipe(gulp.dest(paths.dist.js))
    .pipe(browserSync.stream());
}
function js_clean() {
  rimraf(paths.dist.js, function() {});
}

function pages_install() {
  gulp.src(paths.pages)
    .pipe(htmlmin({
      collapseWhitespace: true,
      removeComments: true,
      minifyJS: true,
      minifyCSS: true
    }))
    .pipe(gulp.dest(paths.dist.pages))
    .pipe(browserSync.stream());
}
function pages_clean() {
  rimraf(paths.dist.pages, function() {});
}

function replace_uuid(cb){
  gulp.src(paths.index)
    .pipe(replace('script.js', uuid+'.js'))
    .pipe(replace('style.css', uuid+'.css'))
    .pipe(gulp.dest(paths.dist.www));
}

gulp.task('watch', ['install'], function() {
  /*gulp.watch(['www/**',], function() {
    browserSync.reload();
  });*/
  gulp.watch([paths.index,paths.less,paths.js,paths.pages],replace_uuid());
  gulp.watch(paths.pages,pages_install());
  gulp.watch(paths.less,less_install());
  gulp.watch(paths.js,js_install());
  
});

gulp.task('default',['clean','install']);

gulp.task('serve', ['watch'], function() {
  browserSync.init({
    server: {
      baseDir: __dirname + '/www/',
      directory: false
    },
    ghostMode: false,
    notify: false,
    debounce: 200,
    index: 'index.html'
  });
});
