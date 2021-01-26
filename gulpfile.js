'use strict';

const   gulp            = require('gulp'),
        pug             = require('gulp-pug'),
        sass            = require('gulp-sass'),
        rename          = require('gulp-rename'),
        postcss         = require('gulp-postcss'),
        autoprefixer    = require('autoprefixer'),
        normalize       = require('node-normalize-scss'),
        imagemin        = require('gulp-imagemin'),
        del             = require('del'),
        svgSprite       = require('gulp-svg-sprite'),
        svgmin          = require('gulp-svgmin'),
        cheerio         = require('gulp-cheerio'),
        replace         = require('gulp-replace'),
        browserSync     = require('browser-sync').create(),
        sourcemaps      = require('gulp-sourcemaps'),
        gulpif          = require('gulp-if'),
        cleanCSS        = require('gulp-clean-css');

const isDev  = (process.argv.indexOf('--dev') !== -1);
const isProd = !isDev;
const isSync = (process.argv.indexOf('--sync') !== -1);

const path = {
    root: './build',
    template: {
        pages: 'src/template/pages/*.pug',
        section: 'src/template/section/*.pug',
        html: 'src/template/**/*.pug'
    },
    style: {
        src: 'src/styles/**/*.scss',
        dest: 'build/styles/'
    },
    image: {
        src: 'src/images/',
        dest: 'build/images/'
    },
    scripts: {
        src: 'src/js/',
        dest: 'build/js/'
    },
    video: {
        src: 'src/video/',
        dest: 'build/video/'
    }
};

// pug
function template() {
    return gulp.src(path.template.pages)
        .pipe(pug({pretty: true}))
        .pipe(gulp.dest(path.root));
}

// Сборка стилей
function style() {
    let processors = [
        autoprefixer({browsers: ['> 0.1%']})
    ];
    return gulp.src('./src/styles/main.scss')
        .pipe(gulpif(isDev, sourcemaps.init()))
        .pipe(sass({includePaths: normalize.includePaths}))
        .pipe(gulpif(isProd, sass({outputStyle: 'compressed'})))
        .pipe(postcss(processors))
        .pipe(gulpif(isProd, cleanCSS({level: 2})))
        .pipe(sourcemaps.write())
        .pipe(gulpif(isProd, rename({ suffix: ".min" })))
        .pipe(gulp.dest(path.style.dest));
}

// Сборка изображений
function image() {
    return gulp.src(path.image.src + '**/*.*')
        .pipe(imagemin({
            optimizationLevel: 3,
            progessive: true,
            interlaced: true,
            removeViewBox:false,
            removeDimensions: false,
            removeComments:true,
            removeUselessStrokeAndFill:false,
            cleanupIDs:true
        }))
        .pipe(gulp.dest(path.image.dest));
}

// Сборка видео
function video() {
    return gulp.src(path.video.src + '**/*.*')
        .pipe(gulp.dest(path.video.dest));
}

// Сборка svg
function svg(done)  {
    const prettySvgs = function() {
    return gulp
        .src(`src/images/icons/*.svg`)
        .pipe(
            svgmin({
                js2svg: {
                    pretty: true
                }
            })
        )
        .pipe(
            cheerio({
                run($) {
                    $("[fill], [stroke], [style], [width], [height]")
                        .removeAttr("fill")
                        // .removeAttr("stroke")
                        .removeAttr("style")
                        .removeAttr("width")
                        .removeAttr("height");
                },
                parserOptions: { xmlMode: true }
            })
        )
        .pipe(replace("&gt;", ">"));
};

prettySvgs()
    .pipe(
        svgSprite({
            mode: {
                symbol: {
                    sprite: "../sprite.svg"
                }
            }
        })
    )
    .pipe(gulp.dest(`build/images/icons`));
done();
}

// Сборка шрифтов
function fonts() {
    return gulp.src('src/fonts/**/*')
        .pipe(gulp.dest('build/fonts'))
}

// js
function script() {
    return gulp.src('./src/js/**/*')
        .pipe(gulp.dest(path.scripts.dest));
}
// libs js
function scriptLib() {
    return gulp.src('./src/js/libs/*')
        .pipe(gulp.dest(path.scripts.dest));
}

// очистка
function clean() {
    return del(path.root);
}

// watcher
function watch() {
    gulp.watch(path.style.src, style);
    gulp.watch(path.template.pages, template);
    gulp.watch(path.template.section, template);
    gulp.watch(path.image.src, image);
    gulp.watch(path.scripts.src, script);
}

// локальный сервер
function server() {
    if(isSync){
        browserSync.init({
            server: path.root
        });
    browserSync.watch(path.root + '/**/*.*', browserSync.reload);
    }
}

exports.template = template;
exports.style = style;
exports.image = image;
exports.script = script;
exports.clean = clean;

gulp.task('default', gulp.series(
    clean,
    gulp.parallel(style, template, fonts, image, video, script, svg, scriptLib),
    gulp.parallel(watch, server)
));