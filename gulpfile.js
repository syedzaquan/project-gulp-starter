const { src, dest, watch, series } = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const postcss = require('gulp-postcss');
const cssnano = require('cssnano');
const terser = require('gulp-terser');
const browsersync = require('browser-sync').create();

// Sass Task
function scssTask(){
  return src('src/scss/**/*.scss', { sourcemaps: true })
    .pipe(sass({
      includePaths: require("node-normalize-scss").includePaths
    }))
    .pipe(postcss([cssnano()]))
    .pipe(dest('assets/css/', { sourcemaps: '.' }));
}

// JavaScript Task
function jsTask(){
  return src('src/js/script.js', { sourcemaps: true })
    .pipe(terser())
    .pipe(dest('assets/js/', { sourcemaps: '.' }));
}

// Browsersync Tasks
function browsersyncServe(cb){
  browsersync.init({
    server: {
      baseDir: '/themes/demo/pages/**/*.htm'
    }
  });
  cb();
}

function browsersyncReload(cb){
  browsersync.reload();
  cb();
}

// Watch Task
function watchTask(){
  // watch('*.html', browsersyncReload);
  watch(['src/scss/**/*.scss', 'src/js/**/*.js'], series(scssTask, jsTask));
}

// Default Gulp task
exports.default = series(
  scssTask,
  jsTask,
  watchTask
);