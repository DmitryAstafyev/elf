var gulp            = require('gulp'),
    less            = require('gulp-less'),
    concat          = require('gulp-concat'),
    sourcemaps      = require('gulp-sourcemaps'),
    webpack_stream  = require('webpack-stream'),
    webpack         = require('webpack'),
    gutil           = require("gulp-util"),
    config          = {
        WEBPACK_ENTRY   : './client/src/app.js',
        WEBPACK_OUT_DIR : './client/public/js',
        WEBPACK_OUT_FILE: 'app.js',
        LESS_SRC        : ['./client/src/less/variables.less', './client/src/less/page.less', './client/src/less/*.less'],
        LESS_DEST       : './client/public/css'
    },
    webpack_config = {
        entry   : config.WEBPACK_ENTRY,
        devtool : "source-map",
        output  : {
            path    : config.WEBPACK_OUT_DIR,
            filename: config.WEBPACK_OUT_FILE
        },
        module  : {
            loaders: [{
                test    : /\.js$/,
                exclude : /node_modules/,
                loader  : 'babel', 
                query   : {
                    presets: ['es2015']
                }
            }]
        },
        plugins: [
            new webpack.optimize.UglifyJsPlugin({
                mangle: {
                    except: ['modules', 'exports', 'require']
                }
            })
        ],
    };

gulp.task('less', function () {
    return gulp.src(config.LESS_SRC)
        .pipe(sourcemaps.init())
        .pipe(concat('styles.css'))
        .pipe(less())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(config.LESS_DEST));
});

gulp.task("webpack", function (callback) {
    webpack(webpack_config, function (err, stats) {
        if (err) throw new gutil.PluginError("webpack", err);
        gutil.log("[webpack]", stats.toString({}));
        callback();
    });
});

gulp.task('build', function () {
    return gulp.run('less', 'webpack');
});

