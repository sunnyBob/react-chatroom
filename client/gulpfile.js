const gulp = require('gulp');
const webpack = require('webpack');
const webpackStream = require('webpack-stream');
const rename = require('gulp-rename');
const less = require('gulp-less');
const cleanCss = require('gulp-clean-css');
const pump = require('pump');
const plumber = require('gulp-plumber');
const notify = require('gulp-notify');

gulp.task('minifyCss', ['less2css'], cb => {
  pump([
    gulp.src('./src/style/css/main.css'),
    cleanCss({debug: true}, details => {
      console.log(details.name + ' 初始size: ' + details.stats.originalSize);
      console.log(details.name + ' 压缩后size: ' + details.stats.minifiedSize);
    }),
    gulp.dest('./dist/style'),
    notify('css压缩完成...')
  ], cb);
});

const webpackCongig = {
  module: {
    rules: [{
      test: /\.jsx?$/,
      exclude: /node_modules/,
      use: 'babel-loader',
    }]
  },
  devtool: 'eval-source-map',
  resolve: {
    extensions: ['.js', '.jsx', 'css'],
  },
  plugins: [
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false,
      }
    })
  ],
};

gulp.task('webpack', cb => {
  pump([
    gulp.src('./src/js/app.js'),
    webpackStream(webpackCongig),
    rename('bundle.js'),
    gulp.dest('./dist/js/'),
    notify("打包完成...")
  ], cb)
});

gulp.task('less2css', () => {
  return gulp.src('./src/style/less/main.less')
    .pipe(
      plumber({
        errorHandler: notify.onError("Error: <%= error.message %>")
      })
    )
    .pipe(less())
    .pipe(gulp.dest('./src/style/css'))
    .pipe(notify('less To css finished ...'));
});

gulp.task('build', ['less2css', 'minifyCss', 'copyLib', 'webpack']);

gulp.task('watch', () => {
  gulp.watch('./src/style/less/**/*.less', ['minifyCss']);
  gulp.watch('./src/js/**/*.js', ['webpack']);
});

gulp.task('default', ['watch']);

gulp.task('copyLib', cb => {
  pump([
    gulp.src('./src/lib/**/*'),
    gulp.dest('./dist/lib')
  ], cb)
});
