"use strict";

const browserSync = require("browser-sync");
const gulp = require("gulp");
const autoprefixer = require("gulp-autoprefixer");
const cached = require("gulp-cached");
const debug = require("gulp-debug");
const minifycss = require("gulp-minify-css");
const rimraf = require("gulp-rimraf");
const sass = require("gulp-sass")(require("sass"));
const uglify = require("gulp-uglify");
const util = require("gulp-util");

const reload = browserSync.reload;
const project_name = "happyvr";

const config = {
    dev:  "./build/dev",
    min:  "./build/min",
    wp:   "d:/laragon/www/avirtum/wp-content/plugins/" + project_name,
    host: "https://avirtum.dev/wp-admin/"
}

function do_clean() {
    return gulp.src([config.dev + "/*", config.min + "/*", config.wp + "/*"], {read: false}).pipe(rimraf({force: true}));
}

function do_browserSync(done) {
    browserSync({
        proxy: {
            target: config.host,
            middleware: function(req, res, next) {
                res.setHeader("Access-Control-Allow-Origin", "*");
                next();
            }
        },
        injectChanges: true
    });
    done();
}

function do_scss() {
    return gulp.src(["src/**/*.scss"], {base: "src"})
        .pipe(cached("cache_scss"))
        .pipe(debug())
        .pipe(sass())
        .pipe(autoprefixer())
        .pipe(gulp.dest(config.dev))
        .pipe(gulp.dest(config.wp))
        .pipe(minifycss())
        .pipe(gulp.dest(config.min))
        .pipe(reload({stream: true})); // inject styles
}

function do_styles() {
    return gulp.src(["src/**/*.css"], {base: "src"})
        .pipe(cached("cache_styles"))
        .pipe(debug())
        .pipe(autoprefixer())
        .pipe(gulp.dest(config.dev))
        .pipe(gulp.dest(config.wp))
        .pipe(minifycss())
        .pipe(gulp.dest(config.min))
        .pipe(reload({stream: true})); // inject styles
}

function do_scripts() {
    return gulp.src(["src/**/*.js", "!src/**/*.min.js"], {base: "src"})
        .pipe(cached("cache_scripts"))
        .pipe(debug())
        .pipe(gulp.dest(config.dev))
        .pipe(gulp.dest(config.wp))
        .pipe(uglify({
            output: {
                beautify: false,
                comments: "/^@preserve|@license|@cc_on/i"
            }
        }).on("error", util.log))
        .pipe(gulp.dest(config.min))
        .pipe(reload({stream: true})); // inject scripts
}

function do_php() {
    return gulp.src(["src/**/*.php"], {base: "src"})
        .pipe(cached("cache_php"))
        .pipe(debug())
        .pipe(gulp.dest(config.dev))
        .pipe(gulp.dest(config.min))
        .pipe(gulp.dest(config.wp))
        .pipe(reload({ stream: true }));
}

function do_copy() {
    return gulp.src(["src/**/*.txt", "src/assets/**/*.svg", "src/languages/*.*"], {base: "src"})
        .pipe(cached("cache_copy"))
        .pipe(debug())
        .pipe(gulp.dest(config.dev))
        .pipe(gulp.dest(config.min))
        .pipe(gulp.dest(config.wp))
        .pipe(reload({ stream: true }));
}

function do_watch(done) {
    gulp.watch(["src/**/*.scss"], do_scss);
    gulp.watch(["src/**/*.css"], do_styles);
    gulp.watch(["src/**/*.js"], do_scripts);
    gulp.watch(["src/**/*.php"], do_php);
    gulp.watch(["src/**/*.*", "!src/**/*.php"], do_copy);
    done();
}

const build = gulp.series(
    do_clean,
    do_scss,
    do_styles,
    do_scripts,
    do_php,
    do_copy,
    do_watch,
    do_browserSync
)

exports.default = build;