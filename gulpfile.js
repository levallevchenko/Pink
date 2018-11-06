"use strict";

var gulp = require("gulp");
var rename = require("gulp-rename");
var less = require("gulp-less");
var plumber = require("gulp-plumber");
var postcss = require("gulp-postcss");
var autoprefixer = require("autoprefixer");
var server = require("browser-sync").create();
var svgstore = require("gulp-svgstore");
var posthtml = require("gulp-posthtml");
var include = require("posthtml-include");
var csso = require("gulp-csso");
var del = require("del");
var webp = require("gulp-webp");



gulp.task("css", function () {
  return gulp.src("less/style.less")
    .pipe(plumber())
    .pipe(less())
    .pipe(postcss([
      autoprefixer()
    ]))
    .pipe(gulp.dest("css"))
    .pipe(csso())
    .pipe(rename("style.min.css"))
    .pipe(gulp.dest("css"))
    .pipe(server.stream());
});

gulp.task("sprite", function () {
    return gulp.src("img/*.svg")
    .pipe(svgstore({
      inlineSvg: true
    }))
    .pipe(rename("sprite.svg"))
    .pipe(gulp.dest("build/img"));
});

gulp.task("html", function () {
  return gulp.src("*.html")
    .pipe(posthtml([
      include()
    ]))
    .pipe(gulp.dest("build"));
});

gulp.task("webp", function () {
  return gulp.src("img/**/*.{png,jpg}")
    .pipe(webp({quality: 90}))
    .pipe(gulp.dest("build/img"));
});

gulp.task("copy", function () {
  return gulp.src([
      "fonts/**/*.{woff,woff2}",
      "img/**",
      "js/**"
    ], {
      base: "source"
})
    .pipe(gulp.dest("build"));
});

gulp.task("clean", function () {
  return del("build");
});

gulp.task("server", function () {
  server.init({
    server: ".",
    notify: false,
    open: true,
    cors: true,
    ui: false
  });

  gulp.watch("less/**/*.less", gulp.series("css"));
  gulp.watch("img/icon-*.svg", gulp.series("sprite", "html", "refresh"));
  gulp.watch("*.html", gulp.series("html", "refresh"));
});

gulp.task("refresh", function (done) {
  server.reload();
  done();
});

gulp.task("build", gulp.series("clean",
  "copy", "css", "sprite", "html"));
gulp.task("start", gulp.series("css", "server"));
