const gulp = require("gulp");
const replace = require("gulp-replace");
const gulprename = require("gulp-rename");
const runSequence = require("run-sequence");
const clean = require("gulp-clean");
const rimraf = require('gulp-rimraf');
const image = require('gulp-image');
const dir_settings = "./src/styles/settings/";
const dir_src = "./src/";
const dir_docs = "./docs/";
const dir_root = "./";

gulp.task('setFileCssDarkName', function () {

    var task = gulp.src(dir_settings + "_all.scss");

    task = task.pipe(replace(/@import "colors.scss"/g, '@import "colors-dark.scss"'));
    task = task.pipe(gulp.dest(dir_settings));

    return task;

});

gulp.task('setFileCssDefaultName', function () {

    var task = gulp.src(dir_settings + "_all.scss");

    task = task.pipe(replace(/@import "colors-dark.scss"/g, '@import "colors.scss"'));
    task = task.pipe(gulp.dest(dir_settings));

    return task;

});

gulp.task('removeLib', [], function() {

    return gulp.src("./lib", { read: false }).pipe(rimraf());

});

gulp.task('getCSSMINToFolderLib', function () {

    var task = gulp.src(dir_docs + "meg.min.css");
    task = task.pipe(gulp.dest(dir_root + "lib/"));

    return task;

});

gulp.task('getCSSMINAndRenameToDark', function () {

    var task = gulp.src(dir_docs + "meg.min.css");

    task = task.pipe(gulprename(function (path) {
        path.basename = "meg-dark.min";
        path.extname = ".css";
    }));

    task = task.pipe(gulp.dest(dir_root));

    return task;

});

gulp.task('getCSSDarkMINToFolderLib', function () {

    var task = gulp.src(dir_root + "meg-dark.min.css");
    task = task.pipe(clean({ force: true }));

    task = task.pipe(gulp.dest(dir_root + "lib/"));
    task = task.pipe(gulp.dest(dir_docs));

    return task;

});

gulp.task('getJSMINToFolderLib', function () {

    var task = gulp.src(dir_docs + "meg.app.min.js");

    task = task.pipe(gulp.dest(dir_root + "lib/"));

    return task;

});

gulp.task('getImagesSrcToBuild', function () {

    var task = gulp.src(dir_src + "img/*.{jpg,jpeg,png,gif,svg,ico}");

    task = task.pipe(image({
        pngquant: true,
        optipng: false,
        zopflipng: true,
        jpegRecompress: false,
        mozjpeg: true,
        guetzli: false,
        gifsicle: true,
        svgo: true,
        concurrent: 10,
        quiet: false // defaults to false
    }));

    task = task.pipe(gulp.dest(dir_docs + "img/"));
    task = task.pipe(gulp.dest(dir_root + "lib/img/"));

    return task;

});

gulp.task('default',
    function () {
        runSequence(
            'removeLib',
            'getCSSMINToFolderLib',
            'getCSSDarkMINToFolderLib',
            'getJSMINToFolderLib',
            'getImagesSrcToBuild'
        )
    }
);
