const gulp = require("gulp");
const minify = require("gulp-minify");
const stripDebug = require("gulp-strip-debug");
const concat = require("gulp-concat");
const replace = require("gulp-replace");
const purgeCss = require("gulp-purgecss");
const cleanCss = require("gulp-clean-css");
const pdfThumbnail = require("gulp-pdf-thumbnail");
const purgeFromHTML = require("purgecss-from-html");

gulp.task("js", () => {
  return gulp
    .src(["./js/*.js", "!./js/*-min.js", "!./js/search.js"])
    .pipe(stripDebug())
    .pipe(minify({ noSource: true }))
    .pipe(gulp.dest("build/js/"));
});

gulp.task("search", () => {
  return gulp
    .src(["./js/search.js", "./vendor/search-string/search-string.js"])
    .pipe(stripDebug())
    .pipe(minify({ noSource: true }))
    .pipe(concat("search-min.js"))
    .pipe(gulp.dest("build/js"));
});

gulp.task("pdf", () => {
  return gulp
    .src(["./newsletters/*.pdf"])
    .pipe(pdfThumbnail())
    .pipe(gulp.dest("img"));
});

gulp.task("contents", () => {
  return gulp
    .src(["./contents/*.*"])
    .pipe(
      replace(
        '<script src="vendor/search-string/search-string.js" defer></script>',
        ""
      )
    )
    .pipe(replace(/js\/([^.]+)\.js/g, "js/$1-min.js"))
    .pipe(gulp.dest("build/contents/"));
});
gulp.task("index", () => {
  return gulp
    .src(["index.php"])
    .pipe(replace(/js\/([^.]+)\.js/g, "js/$1-min.js"))
    .pipe(gulp.dest("build/"));
});
gulp.task("css", () => {
  return gulp
    .src(["./css/*.css"])
    .pipe(
      purgeCss({
        content: ["build/index.php", "build/contents/*.php", "js/*.js"],
        extractors: [
          {
            extractor: purgeFromHTML,
            extensions: ["php"],
          },
          {
            extractor: (content) => content.match(/[\w-/:]+(?<!:)/g) || [],
            extensions: ["vue", "js"],
          },
        ],
        whitelistPatterns: [/.*(tooltip).*/, /studyImage/],
      })
    )
    .pipe(cleanCss())
    .pipe(gulp.dest("build/css"));
});
gulp.task("copy", function () {
  return gulp
    .src(
      [
        "./sitemap.xml",
        "./img/**/*",
        "./newsletters/*.pdf",
        "./api/**/*",
        "./video/**/*",
        "./json/**/*",
        "vendor/images/**/*",
        "vendor/datatables/jquery.dataTables.min.css",
        "vendor/datatables/fixedHeader.dataTables.min.css",
        "vendor/datatables/responsive.dataTables.min.css",
        "vendor/bootstrap/bootstrap-slider.min.css",
        "vendor/jquery/jquery.min.js",
        "vendor/bootstrap/bootstrap-slider.min.js",
        "vendor/bootstrap/js/bootstrap.bundle.min.js",
        "vendor/jquery-easing/jquery.easing.min.js",
        "vendor/datatables/jquery.dataTables.min.js",
        "vendor/datatables/dataTables.responsive.min.js",
        "vendor/datatables/dataTables.fixedHeader.min.js",
        "vendor/fontawesome-free/css/*",
        "vendor/fontawesome-free/webfonts/*",
      ],
      {
        base: "./",
      }
    )
    .pipe(gulp.dest("build/"));
});

gulp.task(
  "default",
  gulp.series(["search", "contents", "index", "js", "css", "copy"])
);
