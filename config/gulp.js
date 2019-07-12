const del = require('del');
const gulp = require('gulp');
const sass = require('gulp-sass');
const gulpif = require('gulp-if');
const rename = require('gulp-rename');
const notify = require('gulp-notify');
const uglify = require('gulp-uglify');
const plumber = require('gulp-plumber');
const spritesmith = require('gulp.spritesmith');
const buffer = require('vinyl-buffer');
const csso = require('gulp-csso');
const merge = require('merge-stream');
const webpack = require('webpack-stream');
const bundler = require('webpack');
const cleanCSS = require('gulp-clean-css');
const sourcemaps = require('gulp-sourcemaps');
const browserSync = require('browser-sync').create();
const autoprefixer = require('gulp-autoprefixer');
const image = require('gulp-image');
const posthtml = require('gulp-posthtml');
const htmlLint = require('gulp-html-linter');
const eslint = require('gulp-eslint');
const gulpStylelint = require('gulp-stylelint');
const htmlbeautify = require('gulp-html-beautify');

const utils = require('./utils');
const settings = require('./settings');

const { isProd, isDev } = utils.detectEnv();
const taskClean = () => del([utils.buildPath()], { force: true });
const taskCleanbuildPathSprites = () => del([utils.buildPath("assets/images/sprites")], { force: true });
const taskCleanbuildPartials = () => del([utils.buildPath("partials")], { force: true });

const error = function (e) {
    notify.onError({
        title: 'Gulp',
        message: e.message,
        sound: 'Beep'
    })(e);

    this.emit('end');
};

const taskSass = () => {

    let task = gulp.src(utils.srcStylesPath('style.scss'));
    const dest = utils.buildStylesPath();

    task = task.pipe(sourcemaps.init());
    task = task.pipe(sass().on('error', sass.logError));
    task = task.pipe(autoprefixer({
        browsers: settings.supportedBrowsers,
        cascade: true
    }))

    task = task.pipe(gulpif(isProd, cleanCSS()));
    task = task.pipe(gulpif(isDev, sourcemaps.write()))
    task = task.pipe(gulpif(isDev, plumber({ errorHandler: error })))
    task = task.pipe(rename(settings.projectName + '.min.css'));
    task = task.pipe(plumber());
    task = task.pipe(gulp.dest(dest));
    task = task.pipe(browserSync.stream());

    return task;

};

const taskScripts = () => {

    let task = gulp.src(utils.srcScriptsPath('main.js'));
    const dest = utils.buildScriptsPath();

    task = task.pipe(plumber({ errorHandler: error }));
    task = task.pipe(gulpif(
        settings.enableWebpack,
        webpack(require('./webpack'), bundler),
        rename(settings.projectName + '.min.js')
    ))

    task = task.pipe(gulpif(
        (isProd && !settings.enableWebpack),
        uglify()
    ));

    task = task.pipe(gulp.dest(dest));
    task = task.pipe(browserSync.stream());

    return task;

};

optionsToHtmlbeautify = {
    "indent_size": 2,
    "indent_char": " ",
    "eol": "\n",
    "indent_level": 0,
    "indent_with_tabs": false,
    "preserve_newlines": true,
    "max_preserve_newlines": 0,
    "jslint_happy": false,
    "space_after_anon_function": false,
    "brace_style": "collapse",
    "keep_array_indentation": false,
    "keep_function_indentation": false,
    "space_before_conditional": true,
    "break_chained_methods": false,
    "eval_code": false,
    "unescape_strings": false,
    "wrap_line_length": 0,
    "wrap_attributes": "auto",
    "wrap_attributes_indent_size": 4,
    "end_with_newline": false
}

const taskHtmlPages = () => {

    let task = gulp.src(
        utils.srcPath('**/*.html'),
        `!${utils.srcPath('partials/*.html')}`,
        `!${utils.srcPath('assets/*.html')}`
    );

    const dest = utils.buildPath();
    const config = require('./posthtml');

    task = task.pipe(plumber({ errorHandler: error }));
    task = task.pipe(posthtml(config))
    task = task.pipe(htmlbeautify(optionsToHtmlbeautify));
    task = task.pipe(gulp.dest(dest));
    task = task.pipe(browserSync.stream());

    return task;

};

const taskHtmlPage = (file, folder) => {

    let task = gulp.src(file);

    const dest = utils.buildPath(folder);
    const config = require('./posthtml');

    task = task.pipe(plumber({ errorHandler: error }));
    task = task.pipe(posthtml(config))
    task = task.pipe(htmlbeautify(optionsToHtmlbeautify));
    task = task.pipe(gulp.dest(dest));
    task = task.pipe(browserSync.stream());

    return task;

};

const taskVendors = () => {

    const src = utils.srcVendorPath('**/*');
    const dest = utils.buildVendorPath();

    let task = gulp.src(src);
    task = task.pipe(plumber({ errorHandler: error }));
    task = task.pipe(gulp.dest(dest));
    task = task.pipe(browserSync.stream());

    return task;

};

const taskFonts = () => {

    const src = utils.srcFontsPath('**/*');
    const dest = utils.buildFontsPath();

    let task = gulp.src(src);
    task = task.pipe(plumber({ errorHandler: error }));
    task = task.pipe(gulp.dest(dest));
    task = task.pipe(browserSync.stream());

    return task;

};

const taskSprites = () => {

    const src = utils.srcSpritesPath('**/*.png');

    let task = gulp.src(src);
    var spriteData = task.pipe(spritesmith({
        imgName: 'sprites.png',
        cssName: 'sprites.scss',
        imgPath: '../images/sprites.png'
    }));

    // Pipe image stream through image optimizer and onto disk
    var imgStream = spriteData.img
        .pipe(buffer())
        .pipe(gulp.dest(utils.srcImagesPath()))
        .pipe(gulp.dest(utils.buildImagesPath()));

    // Pipe CSS stream through CSS optimizer and onto disk
    var cssStream = spriteData.css
        .pipe(csso())
        .pipe(gulp.dest(utils.srcStylesPath()));

    // Return a merged stream to handle both `end` events
    return merge(imgStream, cssStream);

};

const taskMocks = () => {

    const src = utils.srcMocksPath('**/*');
    const dest = utils.buildMocksPath();

    let task = gulp.src(src);
    task = task.pipe(plumber({ errorHandler: error }));
    task = task.pipe(gulp.dest(dest));
    task = task.pipe(browserSync.stream());

    return task;

};

const taskCopyImages = () => {

    const src = [
        utils.srcImagesPath('**/*'),
		`!${utils.srcImagesPath('sprites*')}`,
		`!${utils.srcImagesPath('sprites/*')}`
    ];
    const dest = utils.buildImagesPath();

    let task = gulp.src(src);
    task = task.pipe(plumber({ errorHandler: error }));
    task = task.pipe(gulp.dest(dest));
    task = task.pipe(browserSync.stream());

    return task;

};

const taskOptimizeImages = () => {

    const src = [
        utils.srcImagesPath('**/*.{jpg,jpeg,png,gif,svg,ico}'),
		`!${utils.srcImagesPath('sprites/*')}`
    ];
	const dest = utils.buildImagesPath();

    let task = gulp.src(src);

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

    task = task.pipe(plumber({ errorHandler: error }));
    task = task.pipe(gulp.dest(dest));

    return task;

};

const taskCopyFilesToBuild = () => {

    const src = [
		utils.srcPath('**'),
		`!${utils.srcPath('**/*.html')}`,
		`!${utils.srcPath('partials/')}`,
        `!${utils.srcPath('partials/**')}`,
        `!${utils.srcImagesPath('sprites*')}`,
		`!${utils.srcImagesPath('sprites/*')}`,
		`!${utils.srcPath('assets/{css,scss,fonts,images,js,vendor}/')}`,
		`!${utils.srcPath('assets/{css,scss,fonts,images,js,vendor}/**')}`,
		`!${utils.srcPath('assets/**/*.html')}`
	];
	const dest = utils.buildPath();

    let task = gulp.src(src);
    task = task.pipe(plumber({ errorHandler: error }));
    task = task.pipe(gulp.dest(dest));
    task = task.pipe(browserSync.stream());

    return task;

};

const taskBrowserSync = () => {

    const config = require('./browsersync');

    browserSync.init(config);

};

const HTMLint = () => {

    var task = gulp.src([
        utils.srcPath('*.html'),
        utils.srcPath('partials/*.html')
    ]);

    task = task.pipe(htmlLint([{
        htmllintrc: "./htmllintrc",
        useHtmllintrc: true,
        rules: {},
        plugins: [],
        limitFiles: `Number.MAX_VALUE`,
        limitIssuesPerFile: `Number.MAX_VALUE`,
        limitIssues: `Number.MAX_VALUE`,
    }]));

    task = task.pipe(htmlLint.format());
    //task = task.pipe(htmlLint.failOnError());

    return task;

};

const ESLint = () => {

    var task = gulp.src(utils.srcScriptsPath('**/*.js'));

    task = task.pipe(eslint({
		configFile: '.eslintrc',
        globals: [
            'jQuery',
            '$'
        ],
        envs: [
            'browser'
        ]
    }));

    task = task.pipe(eslint.format());
    // To have the process exit with an error code (1) on
    // lint error, return the stream and pipe to failAfterError last.
    //task = task.pipe(eslint.failAfterError());
    task = task.pipe(eslint.formatEach('compact', process.stderr));
    task = task.pipe(plumber());

    return task;

};

const CSSLint = () => {

    var task = gulp.src([
        utils.srcStylesPath('**/*.scss'),
        `!${utils.srcStylesPath('**/*.min.scss')}`,
        `!${utils.srcStylesPath('**/sprites.scss')}`
    ]);

    task = task.pipe(gulpStylelint({
        failAfterError: false,
        reporters: [
            { formatter: 'string', console: true }
        ]
    }));

    task = task.pipe(plumber());

    return task;

};

gulp.task('html:lint', HTMLint);
gulp.task('css:lint', CSSLint);
gulp.task('js:lint', ESLint);

gulp.task('htmllint', function () {

    gulp.watch(utils.srcPath('**/*.html'), gulp.series('html:lint'));

});

gulp.task('csslint', function () {

	gulp.watch(utils.srcStylesPath('**/*.scss'), gulp.series('css:lint'));

});

gulp.task('jslint', function () {

	gulp.watch(utils.srcScriptsPath('**/*.js'), gulp.series('js:lint'));

});

const taskWatchs = () => {

    gulp.watch([utils.srcStylesPath('**/*.scss'), utils.srcImagesPath('sprites/*.png')], taskSass);
    gulp.watch([utils.srcPath('partials/*')], taskHtmlPages);
    gulp.watch([utils.srcVendorPath('**/*')], taskVendors);
    gulp.watch([utils.srcImagesPath('**/*')], taskCopyImages);
    gulp.watch([utils.srcFontsPath('**/*')], taskFonts);
    gulp.watch([utils.srcMocksPath('**/*')], taskMocks);
    gulp.watch([utils.srcSpritesPath('**/*.png')], taskSprites);

    gulp.watch(utils.srcPath('**/*.html'), gulp.series('html:lint'));
    gulp.watch(utils.srcStylesPath('**/*.scss'), gulp.series('css:lint'));
    gulp.watch(utils.srcScriptsPath('**/*.js'), gulp.series('js:lint'));

    if (!settings.enableWebpack) {
        gulp.watch([
            utils.srcScriptsPath('*.js')
        ], taskScripts);
    }

    gulp.watch([utils.srcPath('ajax/*')]).on('change', file => {
        taskHtmlPage(file, 'ajax/');
    });

    gulp.watch([
        utils.srcPath('**/*.html'),
        `!${utils.srcPath('partials/*')}`,
        `!${utils.srcPath('ajax/*')}`
    ])
        .on('change', file => {
            taskHtmlPage(file, '');
        });

}

gulp.task(
    'dev',
    gulp.series(
        taskClean,
        gulp.parallel(
            taskSprites,
            taskSass,
            taskScripts,
            taskHtmlPages,
            taskCopyFilesToBuild,
            taskVendors,
            taskCopyImages,
            taskFonts,
            taskMocks,
            taskWatchs,
            taskBrowserSync
        )
    )
);

gulp.task(
    'build',
    gulp.series(
        taskClean,
        taskSprites,
        gulp.parallel(
            taskSass,
            taskScripts,
            taskHtmlPages,
            taskCopyFilesToBuild,
            taskVendors,
            taskFonts,
            taskMocks,
            taskOptimizeImages
        ),
        taskCleanbuildPathSprites,
        taskCleanbuildPartials
    )
);

gulp.task('default', gulp.parallel('dev'));
