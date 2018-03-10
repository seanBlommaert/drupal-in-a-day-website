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

// SCSS Watch task
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

// Invokes the "create svgsprite" and "svgsprite cleanup" task.
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

// Invokes the "svg cleanup", "inject-favicon-markups" and "generate-favicon" task.
gulp.task('create favicon', ['svg cleanup', 'generate-favicon', 'inject-favicon-markups'] ,function(){});

// File where the favicon markups are stored
var FAVICON_DATA_FILE = 'faviconData.json';

// Generate the icons. This task takes a few seconds to complete.
// You should run it at least once to create the icons. Then,
// you should run it whenever RealFaviconGenerator updates its
// package (see the check-for-favicon-update task below).
gulp.task('generate-favicon', function(done) {
  realFavicon.generateFavicon({
    masterPicture: 'images/svg/favicon-default.svg',
    dest: 'images/favicon',
    iconsPath: '/themes/custom/diad/images/favicon',
    design: {
      ios: {
        masterPicture: {
          type: 'inline',
          content: 'PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNjAiIGhlaWdodD0iMjYwIiB2aWV3Qm94PSIwIDAgMjYwIDI2MCI+DQogICAgPHBhdGggZmlsbD0iI2ZmZiIgZD0iTTEzMC4zIDIxMi40aC0uNmMtMzIuOSAwLTU5LjYtMjUuOC01OS42LTU3LjUgMC0yNy4xIDE4LjMtNDUuMyAzNy42LTY0LjYgNy45LTcuOSAxNi0xNiAyMi44LTI0LjggNi41IDguMyAxNC4xIDE2IDIxLjYgMjMuNiAxOS41IDE5LjggMzcuOCAzOC41IDM3LjggNjUuNyAwIDMxLjgtMjYuOCA1Ny42LTU5LjYgNTcuNm0yLTE3OS4zbC0yLTEzLjEtMi4yIDEzLjFjLTExIDQwLjEtNzUuNiA2My4yLTc1LjYgMTIxLjggMCA0MS41IDM0LjYgNzUuMSA3Ny4yIDc1LjFoLjZjNDIuNiAwIDc3LjItMzMuNiA3Ny4yLTc1LjEgMC01Ny45LTYzLTgyLjUtNzUuMi0xMjEuOCIvPg0KICAgIDxwYXRoIGZpbGw9IiNmZmYiIGQ9Ik05OS45IDE0OS40SDkxYy0xIDAtMS44LjgtMS44IDEuOHY4LjljMCAxIC44IDEuOCAxLjggMS44aDguOWMxIDAgMS44LS44IDEuOC0xLjh2LTguOWMtLjEtMS0uOS0xLjgtMS44LTEuOG0zNS4xIDMzLjRoLTguOWMtMSAwLTEuOC44LTEuOCAxLjh2OC45YzAgMSAuOCAxLjggMS44IDEuOGg4LjljMSAwIDEuOC0uOCAxLjgtMS44di04LjljMC0xLS44LTEuOC0xLjgtMS44bTI5LjgtMzMuN2gtMjguMnYtMzIuNGwtNi4xLTkuMi02LjEgOC44djQ1bDQwLjMuMSA3LjMtNi4yLTcuMi02LjF6Ii8+DQo8L3N2Zz4NCg=='
        },
        pictureAspect: 'backgroundAndMargin',
        backgroundColor: '#2ba9e0',
        margin: '18%',
        assets: {
          ios6AndPriorIcons: false,
          ios7AndLaterIcons: false,
          precomposedIcons: false,
          declareOnlyDefaultIcon: true
        },
        appName: 'Drupal Training Day'
      },
      desktopBrowser: {},
      windows: {
        masterPicture: {
          type: 'inline',
          content: 'PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNjAiIGhlaWdodD0iMjYwIiB2aWV3Qm94PSIwIDAgMjYwIDI2MCI+DQogICAgPHBhdGggZmlsbD0iI2ZmZiIgZD0iTTEzMC4zIDIxMi40aC0uNmMtMzIuOSAwLTU5LjYtMjUuOC01OS42LTU3LjUgMC0yNy4xIDE4LjMtNDUuMyAzNy42LTY0LjYgNy45LTcuOSAxNi0xNiAyMi44LTI0LjggNi41IDguMyAxNC4xIDE2IDIxLjYgMjMuNiAxOS41IDE5LjggMzcuOCAzOC41IDM3LjggNjUuNyAwIDMxLjgtMjYuOCA1Ny42LTU5LjYgNTcuNm0yLTE3OS4zbC0yLTEzLjEtMi4yIDEzLjFjLTExIDQwLjEtNzUuNiA2My4yLTc1LjYgMTIxLjggMCA0MS41IDM0LjYgNzUuMSA3Ny4yIDc1LjFoLjZjNDIuNiAwIDc3LjItMzMuNiA3Ny4yLTc1LjEgMC01Ny45LTYzLTgyLjUtNzUuMi0xMjEuOCIvPg0KICAgIDxwYXRoIGZpbGw9IiNmZmYiIGQ9Ik05OS45IDE0OS40SDkxYy0xIDAtMS44LjgtMS44IDEuOHY4LjljMCAxIC44IDEuOCAxLjggMS44aDguOWMxIDAgMS44LS44IDEuOC0xLjh2LTguOWMtLjEtMS0uOS0xLjgtMS44LTEuOG0zNS4xIDMzLjRoLTguOWMtMSAwLTEuOC44LTEuOCAxLjh2OC45YzAgMSAuOCAxLjggMS44IDEuOGg4LjljMSAwIDEuOC0uOCAxLjgtMS44di04LjljMC0xLS44LTEuOC0xLjgtMS44bTI5LjgtMzMuN2gtMjguMnYtMzIuNGwtNi4xLTkuMi02LjEgOC44djQ1bDQwLjMuMSA3LjMtNi4yLTcuMi02LjF6Ii8+DQo8L3N2Zz4NCg=='
        },
        pictureAspect: 'noChange',
        backgroundColor: '#2ba9e0',
        onConflict: 'override',
        assets: {
          windows80Ie10Tile: false,
          windows10Ie11EdgeTiles: {
            small: true,
            medium: true,
            big: false,
            rectangle: false
          }
        },
        appName: 'Drupal Training Day'
      },
      androidChrome: {
        masterPicture: {
          type: 'inline',
          content: 'PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNjAiIGhlaWdodD0iMjYwIiB2aWV3Qm94PSIwIDAgMjYwIDI2MCI+DQogICAgPHBhdGggZmlsbD0iI2ZmZiIgZD0iTTEzMC4zIDIxMi40aC0uNmMtMzIuOSAwLTU5LjYtMjUuOC01OS42LTU3LjUgMC0yNy4xIDE4LjMtNDUuMyAzNy42LTY0LjYgNy45LTcuOSAxNi0xNiAyMi44LTI0LjggNi41IDguMyAxNC4xIDE2IDIxLjYgMjMuNiAxOS41IDE5LjggMzcuOCAzOC41IDM3LjggNjUuNyAwIDMxLjgtMjYuOCA1Ny42LTU5LjYgNTcuNm0yLTE3OS4zbC0yLTEzLjEtMi4yIDEzLjFjLTExIDQwLjEtNzUuNiA2My4yLTc1LjYgMTIxLjggMCA0MS41IDM0LjYgNzUuMSA3Ny4yIDc1LjFoLjZjNDIuNiAwIDc3LjItMzMuNiA3Ny4yLTc1LjEgMC01Ny45LTYzLTgyLjUtNzUuMi0xMjEuOCIvPg0KICAgIDxwYXRoIGZpbGw9IiNmZmYiIGQ9Ik05OS45IDE0OS40SDkxYy0xIDAtMS44LjgtMS44IDEuOHY4LjljMCAxIC44IDEuOCAxLjggMS44aDguOWMxIDAgMS44LS44IDEuOC0xLjh2LTguOWMtLjEtMS0uOS0xLjgtMS44LTEuOG0zNS4xIDMzLjRoLTguOWMtMSAwLTEuOC44LTEuOCAxLjh2OC45YzAgMSAuOCAxLjggMS44IDEuOGg4LjljMSAwIDEuOC0uOCAxLjgtMS44di04LjljMC0xLS44LTEuOC0xLjgtMS44bTI5LjgtMzMuN2gtMjguMnYtMzIuNGwtNi4xLTkuMi02LjEgOC44djQ1bDQwLjMuMSA3LjMtNi4yLTcuMi02LjF6Ii8+DQo8L3N2Zz4NCg=='
        },
        pictureAspect: 'backgroundAndMargin',
        margin: '10%',
        backgroundColor: '#2ba9e0',
        themeColor: '#2ba9e0',
        manifest: {
          name: 'Training Day',
          display: 'standalone',
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
          content: 'PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNjAiIGhlaWdodD0iMjYwIiB2aWV3Qm94PSIwIDAgMjYwIDI2MCI+DQogICAgPHBhdGggZmlsbD0iI2ZmZiIgZD0iTTEzMC4zIDIxMi40aC0uNmMtMzIuOSAwLTU5LjYtMjUuOC01OS42LTU3LjUgMC0yNy4xIDE4LjMtNDUuMyAzNy42LTY0LjYgNy45LTcuOSAxNi0xNiAyMi44LTI0LjggNi41IDguMyAxNC4xIDE2IDIxLjYgMjMuNiAxOS41IDE5LjggMzcuOCAzOC41IDM3LjggNjUuNyAwIDMxLjgtMjYuOCA1Ny42LTU5LjYgNTcuNm0yLTE3OS4zbC0yLTEzLjEtMi4yIDEzLjFjLTExIDQwLjEtNzUuNiA2My4yLTc1LjYgMTIxLjggMCA0MS41IDM0LjYgNzUuMSA3Ny4yIDc1LjFoLjZjNDIuNiAwIDc3LjItMzMuNiA3Ny4yLTc1LjEgMC01Ny45LTYzLTgyLjUtNzUuMi0xMjEuOCIvPg0KICAgIDxwYXRoIGZpbGw9IiNmZmYiIGQ9Ik05OS45IDE0OS40SDkxYy0xIDAtMS44LjgtMS44IDEuOHY4LjljMCAxIC44IDEuOCAxLjggMS44aDguOWMxIDAgMS44LS44IDEuOC0xLjh2LTguOWMtLjEtMS0uOS0xLjgtMS44LTEuOG0zNS4xIDMzLjRoLTguOWMtMSAwLTEuOC44LTEuOCAxLjh2OC45YzAgMSAuOCAxLjggMS44IDEuOGg4LjljMSAwIDEuOC0uOCAxLjgtMS44di04LjljMC0xLS44LTEuOC0xLjgtMS44bTI5LjgtMzMuN2gtMjguMnYtMzIuNGwtNi4xLTkuMi02LjEgOC44djQ1bDQwLjMuMSA3LjMtNi4yLTcuMi02LjF6Ii8+DQo8L3N2Zz4NCg=='
        },
        pictureAspect: 'silhouette',
        themeColor: '#2ba9e0'
      }
    },
    settings: {
      scalingAlgorithm: 'Mitchell',
      errorOnImageTooSmall: false,
      readmeFile: true,
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
// templates/favicontemplate.html.
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
