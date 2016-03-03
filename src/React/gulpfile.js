"use strict";

var fs = require('fs');
var gulp = require('gulp');
var named = require('vinyl-named');
var webpack = require('webpack');
var webpackStream = require('webpack-stream');
var uglify = require('gulp-uglify');
var babelrc = JSON.parse(fs.readFileSync('./.babelrc'));
var ExtractTextPlugin = require('extract-text-webpack-plugin');

var OUTPUT_DIR = './wwwroot/pack/';

gulp.task('default', ['build']);
gulp.task('build', ['build-server-script', 'build-client-script']);

gulp.task('build-server-script', function() {
	return gulp.src(['./Scripts/server.js'])
		.pipe(named())
		.pipe(webpackStream({
			module: {
				loaders: [
					{ test: /\.jsx?$/, exclude: /node_modules/, loaders: ['babel?' + JSON.stringify(babelrc)]},
					{ test: /\.css$/, loader: 'css/locals?module' },
					{ test: /\.scss$/, loader: 'css/locals?module!sass' },
					{ test: /\.(woff2?|ttf|eot|svg)$/, loader: 'file' },
					{ test: /\.(jpeg|jpeg|gif|png|tiff)$/, loader: 'file' }
				]
			},
			output: {
				filename: '[name].generated.js',
				libraryTarget: 'this'
			}
		}))
		.pipe(gulp.dest(OUTPUT_DIR));
});

gulp.task('build-client-script', function() {
	var extractCSS = new ExtractTextPlugin('styles.css');
	return gulp.src(['./Scripts/client.js'])
		.pipe(named())
		.pipe(webpackStream({
      entry: {
        'client': [
          'bootstrap-loader',
          './Scripts/client.js'
        ]
      },
			module: {
				loaders: [
					{ test: /\.jsx?$/, exclude: /node_modules/, loaders: ['babel?' + JSON.stringify(babelrc)]},
					{ test: /\.css$/, loader: extractCSS.extract('style', 'css?modules') },
					{ test: /\.scss$/, loader: extractCSS.extract('style', 'css?modules!sass') },
					{ test: /\.(woff2?|ttf|eot|svg)$/, loader: 'file' },
					{ test: /\.(jpeg|jpeg|gif|png|tiff)$/, loader: 'file' }
				]
			},
			output: {
				filename: '[name].generated.js',
				libraryTarget: 'this'
			},
			plugins: [
				extractCSS
			]
		}))
		.pipe(gulp.dest(OUTPUT_DIR));
});
