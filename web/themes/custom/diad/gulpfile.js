//------------------------------------------------------------------------------
// gulpfile.js
// name = "drupal frontend tools"
// version = "1.0.5"
//------------------------------------------------------------------------------

var autoprefixer = require('autoprefixer');
var gulp = require('gulp');
var postcss = require('gulp-postcss');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var svgstore = require('gulp-svgstore');
var svgmin = require('gulp-svgmin');
var path = require('path');
var realFavicon = require ('gulp-real-favicon');
var fs = require('fs');

//------------------------------------------------------------------------------
// Styles section.
//------------------------------------------------------------------------------

// Default task, invokes the "watch sass" and "styles" task.
gulp.task('default', ['styles', 'watch sass'] ,function() {
});

// Watch task
gulp.task('watch sass', [] ,function() {
  gulp.watch(['sass/**/*.scss'],['styles']);
});

// Create scss, with sourcemaps and autoprefixer which uses browserlist in
// packages.json for reference.
gulp.task('styles', function() {
  return gulp.src('sass/**/*.scss')
  .pipe(sourcemaps.init())
  .pipe(sass({outputStyle: 'expanded'}).on('error', sass.logError))
  .pipe(postcss([
    autoprefixer(),
    require('postcss-normalize')({})
  ]))
  .pipe(sourcemaps.write('.'))
  .pipe(gulp.dest('css'))
});

//------------------------------------------------------------------------------
// SVG section.
// We prefer to use SVG sprites, but sometimes you need quick fixes.
//------------------------------------------------------------------------------

// Minify/optimize images using SVGO.
gulp.task('svg cleanup', function () {
  return gulp.src('images/svg/*.svg')
  .pipe(svgmin(function (file) {
    var prefix = path.basename(file.relative, path.extname(file.relative));
    return {
      plugins: [
        {cleanupIDs: {prefix: prefix + '-', minify: true}},
        {removeViewBox: false},
        {removeDimensions: false},
        {sortAttrs: true},
      ]
    }
  }))
  .pipe(svgmin({
    js2svg: {
      pretty: true
    }
  }))
  .pipe(gulp.dest('images/svg'))
});

//------------------------------------------------------------------------------
// svgsprite section.
//------------------------------------------------------------------------------

// Invokes the "svg pretty" and "svg sprite" task.
gulp.task('create svgsprite', ['svgsprite cleanup', 'svgsprite generate sprite'] ,function(){});

// Minify/optimize images using SVGO.
gulp.task('svgsprite cleanup', function () {
  return gulp.src('images/svgsprite/*.svg')
  .pipe(svgmin(function (file) {
    var prefix = path.basename(file.relative, path.extname(file.relative));
    return {
      plugins: [
        {cleanupIDs: {prefix: prefix + '-', minify: true}},
        {removeViewBox: false},
        {removeDimensions: false},
        {sortAttrs: true},
      ]
    }
  }))
  .pipe(svgmin({
    js2svg: {
      pretty: true
    }
  }))
  .pipe(gulp.dest('images/svgsprite'))
});

// Create sprite with symbols (filename is symbol-ID)
gulp.task('svgsprite generate sprite', function () {
  return gulp
  .src('images/svgsprite/*.svg')
  .pipe(svgmin(function (file) {
    var prefix = path.basename(file.relative, path.extname(file.relative));
    return {
      plugins: [
        {cleanupIDs: {prefix: prefix + '-', minify: true}},
        {removeViewBox: false},
        {removeDimensions: true},
      ]
    }
  }))
  .pipe(svgstore({ inlineSvg: true }))
  .pipe(gulp.dest('images'))
});

//------------------------------------------------------------------------------
// Favicon section.
//------------------------------------------------------------------------------

// Invokes the "svg pretty" and "svg sprite" task.
gulp.task('create favicon', ['favicon cleanup', 'generate-favicon', 'inject-favicon-markups'] ,function(){});

// Minify/optimize images using SVGO.
gulp.task('favicon cleanup', function () {
  return gulp.src('images/favicon/*.svg')
  .pipe(svgmin(function (file) {
    var prefix = path.basename(file.relative, path.extname(file.relative));
    return {
      plugins: [
        {cleanupIDs: {prefix: prefix + '-', minify: true}},
        {removeViewBox: false},
        {removeDimensions: false},
        {sortAttrs: true},
      ]
    }
  }))
  .pipe(svgmin({
    js2svg: {
      pretty: true
    }
  }))
  .pipe(gulp.dest('images/favicon'));
});

// File where the favicon markups are stored
var FAVICON_DATA_FILE = 'faviconData.json';

// Generate the icons. This task takes a few seconds to complete.
// You should run it at least once to create the icons. Then,
// you should run it whenever RealFaviconGenerator updates its
// package (see the check-for-favicon-update task below).
gulp.task('generate-favicon', function(done) {
  realFavicon.generateFavicon({
    masterPicture: 'images/favicon/favicon-default.svg',
    dest: 'images/favicon',
    iconsPath: '/themes/custom/diad/images/favicon',
    design: {
      ios: {
        masterPicture: {
          type: 'inline',
          content: 'PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNjAiIGhlaWdodD0iMjYwIiB2aWV3Qm94PSIwIDAgMjYwIDI2MCI+DQogICAgPHRpdGxlPg0KICAgICAgICBGYXZpY29uIERlbGZ0DQogICAgPC90aXRsZT4NCiAgICA8cGF0aCBmaWxsPSIjZmZmIiBkPSJNMjQ1LjEgMTI1LjJjLTE5LS4xLTM0LjQtMTUuNS0zNC40LTM0LjUgMC0yLjEtMS43LTMuOC0zLjgtMy44cy0zLjggMS43LTMuOCAzLjhjLjQgMTkuMS0xNC43IDM0LjktMzMuOCAzNS4zcy0zNC45LTE0LjctMzUuMy0zMy44di0xLjVjLS4xLTIuMS0yLTMuNy00LjEtMy42LTEuOS4xLTMuNSAxLjctMy42IDMuNiAwIDE5LjEtMTUuNSAzNC41LTM0LjUgMzQuNXMtMzQuNS0xNS41LTM0LjUtMzQuNWMtLjEtMi4xLTItMy43LTQuMS0zLjYtMS45LjEtMy41IDEuNy0zLjYgMy42IDAgMTkuMS0xNS41IDM0LjUtMzQuNSAzNC41VjQ4LjRDMzQgNDguNCA0OS41IDMzIDQ5LjUgMTMuOWMuMS0yLjEgMi0zLjcgNC4xLTMuNiAxLjkuMSAzLjUgMS43IDMuNiAzLjYuMyAxOS4xIDE2LjEgMzQuMiAzNS4yIDMzLjggMTguNS0uNCAzMy40LTE1LjMgMzMuOC0zMy44LS4xLTIuMSAxLjUtNCAzLjYtNC4xIDIuMS0uMSA0IDEuNSA0LjEgMy42di41YzAgMTkuMSAxNS41IDM0LjUgMzQuNSAzNC42IDE5LjEgMCAzNC41LTE1LjUgMzQuNi0zNC41IDAtMi4xIDEuNy0zLjggMy44LTMuOHMzLjggMS43IDMuOCAzLjhjMCAxOSAxNS40IDM0LjUgMzQuNCAzNC41djc2LjdtLjEgNzYuOXYtMTIuNmgtMTYuM3YtMTloLTMuMmwtMjEgMjguNHYzLjNoNS42VjIzMGMwIDE1LjIgMTAuNiAyMC4yIDE5LjcgMjAuMiA1LjMgMCA5LjUtMS4zIDE1LjItNXYtMTMuN2MtMy45IDMuMi02LjYgNC40LTkuNiA0LjQtNC45IDAtNi43LTMuOS02LjctOS41di0yNC4zaDE2LjN6Ii8+DQogICAgPHBhdGggZmlsbD0iI2ZmZiIgZD0iTTE3Ny40IDIwMi4xaC01Ljh2LTEyLjZoNS44di00LjJjMC0xNy4zIDExLjMtMjUuNCAyNC43LTI1LjQgMy4zIDAgNi43LjQgOS45IDEuMnYxMy4xYy0yLjItLjUtNC40LS43LTYuNi0uOC03IDAtOS41IDMuOS05LjUgMTAuM3Y1LjhoNS4zdjEyLjZoLTUuM1YyNDloLTE4LjZ2LTQ2LjlNMTQzLjQgMTYxSDE2MnY4OGgtMTguNnYtODh6bS0yNC44IDUyLjZjLS4xLTkuOC0yLjUtMTQuNy03LjMtMTQuNy00LjkgMC03LjYgNS40LTcuNiAxNC43aDE0LjltMTUuNSAzMC42Yy02LjUgNC0xNCA2LTIxLjcgNS45LTIyLjIgMC0yNy42LTE3LjgtMjcuNi0yOS44IDAtMTguNiAxMS4yLTMyLjEgMjYuNC0zMi4xIDEzLjggMCAyNC44IDEwLjYgMjQuNSAzMy44aC0zMi4xYy45IDEwLjIgNi4yIDE1LjggMTUgMTUuOCA1IDAgOS41LTEuMyAxNS41LTQuN3YxMS4xem0tOTQuNS0xMGMxNC40IDAgMTguOS0xMS4yIDE4LjktMjguOSAwLTE2LjYtNC4xLTI5LjUtMTcuOS0yOS41aC01Ljh2NTguM2w0LjguMU0xNC44IDE2MUg0MWMyNy42IDAgMzggMjEuOSAzOCA0My4zIDAgMjAuMi05LjggNDQuNy0zNyA0NC43SDE1bC0uMi04OHoiLz4NCjwvc3ZnPg0K'
        },
        pictureAspect: 'backgroundAndMargin',
        backgroundColor: '#0078c8',
        margin: '25%',
        assets: {
          ios6AndPriorIcons: false,
          ios7AndLaterIcons: false,
          precomposedIcons: false,
          declareOnlyDefaultIcon: true
        }
      },
      desktopBrowser: {},
      windows: {
        masterPicture: {
          type: 'inline',
          content: 'PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNjAiIGhlaWdodD0iMjYwIiB2aWV3Qm94PSIwIDAgMjYwIDI2MCI+DQogICAgPHRpdGxlPg0KICAgICAgICBGYXZpY29uIERlbGZ0DQogICAgPC90aXRsZT4NCiAgICA8cGF0aCBmaWxsPSIjZmZmIiBkPSJNMjQ1LjEgMTI1LjJjLTE5LS4xLTM0LjQtMTUuNS0zNC40LTM0LjUgMC0yLjEtMS43LTMuOC0zLjgtMy44cy0zLjggMS43LTMuOCAzLjhjLjQgMTkuMS0xNC43IDM0LjktMzMuOCAzNS4zcy0zNC45LTE0LjctMzUuMy0zMy44di0xLjVjLS4xLTIuMS0yLTMuNy00LjEtMy42LTEuOS4xLTMuNSAxLjctMy42IDMuNiAwIDE5LjEtMTUuNSAzNC41LTM0LjUgMzQuNXMtMzQuNS0xNS41LTM0LjUtMzQuNWMtLjEtMi4xLTItMy43LTQuMS0zLjYtMS45LjEtMy41IDEuNy0zLjYgMy42IDAgMTkuMS0xNS41IDM0LjUtMzQuNSAzNC41VjQ4LjRDMzQgNDguNCA0OS41IDMzIDQ5LjUgMTMuOWMuMS0yLjEgMi0zLjcgNC4xLTMuNiAxLjkuMSAzLjUgMS43IDMuNiAzLjYuMyAxOS4xIDE2LjEgMzQuMiAzNS4yIDMzLjggMTguNS0uNCAzMy40LTE1LjMgMzMuOC0zMy44LS4xLTIuMSAxLjUtNCAzLjYtNC4xIDIuMS0uMSA0IDEuNSA0LjEgMy42di41YzAgMTkuMSAxNS41IDM0LjUgMzQuNSAzNC42IDE5LjEgMCAzNC41LTE1LjUgMzQuNi0zNC41IDAtMi4xIDEuNy0zLjggMy44LTMuOHMzLjggMS43IDMuOCAzLjhjMCAxOSAxNS40IDM0LjUgMzQuNCAzNC41djc2LjdtLjEgNzYuOXYtMTIuNmgtMTYuM3YtMTloLTMuMmwtMjEgMjguNHYzLjNoNS42VjIzMGMwIDE1LjIgMTAuNiAyMC4yIDE5LjcgMjAuMiA1LjMgMCA5LjUtMS4zIDE1LjItNXYtMTMuN2MtMy45IDMuMi02LjYgNC40LTkuNiA0LjQtNC45IDAtNi43LTMuOS02LjctOS41di0yNC4zaDE2LjN6Ii8+DQogICAgPHBhdGggZmlsbD0iI2ZmZiIgZD0iTTE3Ny40IDIwMi4xaC01Ljh2LTEyLjZoNS44di00LjJjMC0xNy4zIDExLjMtMjUuNCAyNC43LTI1LjQgMy4zIDAgNi43LjQgOS45IDEuMnYxMy4xYy0yLjItLjUtNC40LS43LTYuNi0uOC03IDAtOS41IDMuOS05LjUgMTAuM3Y1LjhoNS4zdjEyLjZoLTUuM1YyNDloLTE4LjZ2LTQ2LjlNMTQzLjQgMTYxSDE2MnY4OGgtMTguNnYtODh6bS0yNC44IDUyLjZjLS4xLTkuOC0yLjUtMTQuNy03LjMtMTQuNy00LjkgMC03LjYgNS40LTcuNiAxNC43aDE0LjltMTUuNSAzMC42Yy02LjUgNC0xNCA2LTIxLjcgNS45LTIyLjIgMC0yNy42LTE3LjgtMjcuNi0yOS44IDAtMTguNiAxMS4yLTMyLjEgMjYuNC0zMi4xIDEzLjggMCAyNC44IDEwLjYgMjQuNSAzMy44aC0zMi4xYy45IDEwLjIgNi4yIDE1LjggMTUgMTUuOCA1IDAgOS41LTEuMyAxNS41LTQuN3YxMS4xem0tOTQuNS0xMGMxNC40IDAgMTguOS0xMS4yIDE4LjktMjguOSAwLTE2LjYtNC4xLTI5LjUtMTcuOS0yOS41aC01Ljh2NTguM2w0LjguMU0xNC44IDE2MUg0MWMyNy42IDAgMzggMjEuOSAzOCA0My4zIDAgMjAuMi05LjggNDQuNy0zNyA0NC43SDE1bC0uMi04OHoiLz4NCjwvc3ZnPg0K'
        },
        pictureAspect: 'noChange',
        backgroundColor: '#0078c8',
        onConflict: 'override',
        assets: {
          windows80Ie10Tile: false,
          windows10Ie11EdgeTiles: {
            small: true,
            medium: true,
            big: false,
            rectangle: false
          }
        }
      },
      androidChrome: {
        masterPicture: {
          type: 'inline',
          content: 'PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNjAiIGhlaWdodD0iMjYwIiB2aWV3Qm94PSIwIDAgMjYwIDI2MCI+DQogICAgPHRpdGxlPg0KICAgICAgICBGYXZpY29uIERlbGZ0DQogICAgPC90aXRsZT4NCiAgICA8cGF0aCBmaWxsPSIjZmZmIiBkPSJNMjQ1LjEgMTI1LjJjLTE5LS4xLTM0LjQtMTUuNS0zNC40LTM0LjUgMC0yLjEtMS43LTMuOC0zLjgtMy44cy0zLjggMS43LTMuOCAzLjhjLjQgMTkuMS0xNC43IDM0LjktMzMuOCAzNS4zcy0zNC45LTE0LjctMzUuMy0zMy44di0xLjVjLS4xLTIuMS0yLTMuNy00LjEtMy42LTEuOS4xLTMuNSAxLjctMy42IDMuNiAwIDE5LjEtMTUuNSAzNC41LTM0LjUgMzQuNXMtMzQuNS0xNS41LTM0LjUtMzQuNWMtLjEtMi4xLTItMy43LTQuMS0zLjYtMS45LjEtMy41IDEuNy0zLjYgMy42IDAgMTkuMS0xNS41IDM0LjUtMzQuNSAzNC41VjQ4LjRDMzQgNDguNCA0OS41IDMzIDQ5LjUgMTMuOWMuMS0yLjEgMi0zLjcgNC4xLTMuNiAxLjkuMSAzLjUgMS43IDMuNiAzLjYuMyAxOS4xIDE2LjEgMzQuMiAzNS4yIDMzLjggMTguNS0uNCAzMy40LTE1LjMgMzMuOC0zMy44LS4xLTIuMSAxLjUtNCAzLjYtNC4xIDIuMS0uMSA0IDEuNSA0LjEgMy42di41YzAgMTkuMSAxNS41IDM0LjUgMzQuNSAzNC42IDE5LjEgMCAzNC41LTE1LjUgMzQuNi0zNC41IDAtMi4xIDEuNy0zLjggMy44LTMuOHMzLjggMS43IDMuOCAzLjhjMCAxOSAxNS40IDM0LjUgMzQuNCAzNC41djc2LjdtLjEgNzYuOXYtMTIuNmgtMTYuM3YtMTloLTMuMmwtMjEgMjguNHYzLjNoNS42VjIzMGMwIDE1LjIgMTAuNiAyMC4yIDE5LjcgMjAuMiA1LjMgMCA5LjUtMS4zIDE1LjItNXYtMTMuN2MtMy45IDMuMi02LjYgNC40LTkuNiA0LjQtNC45IDAtNi43LTMuOS02LjctOS41di0yNC4zaDE2LjN6Ii8+DQogICAgPHBhdGggZmlsbD0iI2ZmZiIgZD0iTTE3Ny40IDIwMi4xaC01Ljh2LTEyLjZoNS44di00LjJjMC0xNy4zIDExLjMtMjUuNCAyNC43LTI1LjQgMy4zIDAgNi43LjQgOS45IDEuMnYxMy4xYy0yLjItLjUtNC40LS43LTYuNi0uOC03IDAtOS41IDMuOS05LjUgMTAuM3Y1LjhoNS4zdjEyLjZoLTUuM1YyNDloLTE4LjZ2LTQ2LjlNMTQzLjQgMTYxSDE2MnY4OGgtMTguNnYtODh6bS0yNC44IDUyLjZjLS4xLTkuOC0yLjUtMTQuNy03LjMtMTQuNy00LjkgMC03LjYgNS40LTcuNiAxNC43aDE0LjltMTUuNSAzMC42Yy02LjUgNC0xNCA2LTIxLjcgNS45LTIyLjIgMC0yNy42LTE3LjgtMjcuNi0yOS44IDAtMTguNiAxMS4yLTMyLjEgMjYuNC0zMi4xIDEzLjggMCAyNC44IDEwLjYgMjQuNSAzMy44aC0zMi4xYy45IDEwLjIgNi4yIDE1LjggMTUgMTUuOCA1IDAgOS41LTEuMyAxNS41LTQuN3YxMS4xem0tOTQuNS0xMGMxNC40IDAgMTguOS0xMS4yIDE4LjktMjguOSAwLTE2LjYtNC4xLTI5LjUtMTcuOS0yOS41aC01Ljh2NTguM2w0LjguMU0xNC44IDE2MUg0MWMyNy42IDAgMzggMjEuOSAzOCA0My4zIDAgMjAuMi05LjggNDQuNy0zNyA0NC43SDE1bC0uMi04OHoiLz4NCjwvc3ZnPg0K'
        },
        pictureAspect: 'backgroundAndMargin',
        margin: '25%',
        backgroundColor: '#0078c8',
        themeColor: '#0078c8',
        manifest: {
          name: 'Gemeente Delft',
          display: 'browser',
          orientation: 'notSet',
          onConflict: 'override',
          declared: true
        },
        assets: {
          legacyIcon: false,
          lowResolutionIcons: false
        }
      },
      safariPinnedTab: {
        masterPicture: {
          type: 'inline',
          content: 'PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNjAiIGhlaWdodD0iMjYwIiB2aWV3Qm94PSIwIDAgMjYwIDI2MCI+DQogICAgPHRpdGxlPg0KICAgICAgICBGYXZpY29uIERlbGZ0DQogICAgPC90aXRsZT4NCiAgICA8cGF0aCBmaWxsPSIjZmZmIiBkPSJNMjQ1LjEgMTI1LjJjLTE5LS4xLTM0LjQtMTUuNS0zNC40LTM0LjUgMC0yLjEtMS43LTMuOC0zLjgtMy44cy0zLjggMS43LTMuOCAzLjhjLjQgMTkuMS0xNC43IDM0LjktMzMuOCAzNS4zcy0zNC45LTE0LjctMzUuMy0zMy44di0xLjVjLS4xLTIuMS0yLTMuNy00LjEtMy42LTEuOS4xLTMuNSAxLjctMy42IDMuNiAwIDE5LjEtMTUuNSAzNC41LTM0LjUgMzQuNXMtMzQuNS0xNS41LTM0LjUtMzQuNWMtLjEtMi4xLTItMy43LTQuMS0zLjYtMS45LjEtMy41IDEuNy0zLjYgMy42IDAgMTkuMS0xNS41IDM0LjUtMzQuNSAzNC41VjQ4LjRDMzQgNDguNCA0OS41IDMzIDQ5LjUgMTMuOWMuMS0yLjEgMi0zLjcgNC4xLTMuNiAxLjkuMSAzLjUgMS43IDMuNiAzLjYuMyAxOS4xIDE2LjEgMzQuMiAzNS4yIDMzLjggMTguNS0uNCAzMy40LTE1LjMgMzMuOC0zMy44LS4xLTIuMSAxLjUtNCAzLjYtNC4xIDIuMS0uMSA0IDEuNSA0LjEgMy42di41YzAgMTkuMSAxNS41IDM0LjUgMzQuNSAzNC42IDE5LjEgMCAzNC41LTE1LjUgMzQuNi0zNC41IDAtMi4xIDEuNy0zLjggMy44LTMuOHMzLjggMS43IDMuOCAzLjhjMCAxOSAxNS40IDM0LjUgMzQuNCAzNC41djc2LjdtLjEgNzYuOXYtMTIuNmgtMTYuM3YtMTloLTMuMmwtMjEgMjguNHYzLjNoNS42VjIzMGMwIDE1LjIgMTAuNiAyMC4yIDE5LjcgMjAuMiA1LjMgMCA5LjUtMS4zIDE1LjItNXYtMTMuN2MtMy45IDMuMi02LjYgNC40LTkuNiA0LjQtNC45IDAtNi43LTMuOS02LjctOS41di0yNC4zaDE2LjN6Ii8+DQogICAgPHBhdGggZmlsbD0iI2ZmZiIgZD0iTTE3Ny40IDIwMi4xaC01Ljh2LTEyLjZoNS44di00LjJjMC0xNy4zIDExLjMtMjUuNCAyNC43LTI1LjQgMy4zIDAgNi43LjQgOS45IDEuMnYxMy4xYy0yLjItLjUtNC40LS43LTYuNi0uOC03IDAtOS41IDMuOS05LjUgMTAuM3Y1LjhoNS4zdjEyLjZoLTUuM1YyNDloLTE4LjZ2LTQ2LjlNMTQzLjQgMTYxSDE2MnY4OGgtMTguNnYtODh6bS0yNC44IDUyLjZjLS4xLTkuOC0yLjUtMTQuNy03LjMtMTQuNy00LjkgMC03LjYgNS40LTcuNiAxNC43aDE0LjltMTUuNSAzMC42Yy02LjUgNC0xNCA2LTIxLjcgNS45LTIyLjIgMC0yNy42LTE3LjgtMjcuNi0yOS44IDAtMTguNiAxMS4yLTMyLjEgMjYuNC0zMi4xIDEzLjggMCAyNC44IDEwLjYgMjQuNSAzMy44aC0zMi4xYy45IDEwLjIgNi4yIDE1LjggMTUgMTUuOCA1IDAgOS41LTEuMyAxNS41LTQuN3YxMS4xem0tOTQuNS0xMGMxNC40IDAgMTguOS0xMS4yIDE4LjktMjguOSAwLTE2LjYtNC4xLTI5LjUtMTcuOS0yOS41aC01Ljh2NTguM2w0LjguMU0xNC44IDE2MUg0MWMyNy42IDAgMzggMjEuOSAzOCA0My4zIDAgMjAuMi05LjggNDQuNy0zNyA0NC43SDE1bC0uMi04OHoiLz4NCjwvc3ZnPg0K'
        },
        pictureAspect: 'silhouette',
        themeColor: '#0078c8'
      }
    },
    settings: {
      scalingAlgorithm: 'Mitchell',
      errorOnImageTooSmall: false,
      readmeFile: false,
      htmlCodeFile: false,
      usePathAsIs: false
    },
    markupFile: FAVICON_DATA_FILE
  }, function() {
    done();
  });
});

// Inject the favicon markups in your HTML pages.
// The template is stored under:
// patternlab/source/templates/favicontemplate.html.
// Copy the generated tags to the html.html.twig.
gulp.task('inject-favicon-markups', function() {
  return gulp.src([ 'templates/favicontemplate.html' ])
  .pipe(realFavicon.injectFaviconMarkups(JSON.parse(fs.readFileSync(FAVICON_DATA_FILE)).favicon.html_code))
  .pipe(gulp.dest('templates/'));
});

// Check for updates on RealFaviconGenerator (think: Apple has just
// released a new Touch icon along with the latest version of iOS).
// Run this task from time to time. Ideally, make it part of your
// continuous integration system.
gulp.task('check-for-favicon-update', function(done) {
  var currentVersion = JSON.parse(fs.readFileSync(FAVICON_DATA_FILE)).version;
  realFavicon.checkForUpdates(currentVersion, function(err) {
    if (err) {
      throw err;
    }
  });
});
