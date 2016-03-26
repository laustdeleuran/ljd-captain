/*jshint node:true,strict:true,undef:true,unused:true*/
'use strict';



/**
 * Import tasks
 **/
var gulp = require('gulp');
var util = require('gulp-util');
var browserify = require('gulp-browserify');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var bump = require('gulp-bump');
var jshint = require('gulp-jshint');
var fs = require('fs');
var del = require('del');



/**
 * Utilities
 **/
var getPackageJson = function() {
	return JSON.parse(fs.readFileSync('./package.json', 'utf8'));
};



/**
 * Settings
 */
var source = './src/captain.js';
var browserifySettings = {
	standalone: 'Captain'
};



/**
 * Tasks
 */

// Check JS code quality using JSHint.
gulp.task('js-lint', ['config'], function() {
	return gulp.src(source)
		.pipe(jshint())
		.pipe(jshint.reporter('jshint-stylish'));
});

// Versioning
gulp.task('bump', function() {
	return gulp.src('./package.json')
		.pipe(bump({
			type: util.env.bump ? util.env.bump : 'patch'
		}))
		.pipe(gulp.dest('./'));
});

// Uglify
gulp.task('uglify', function() {
	var pkg = getPackageJson();

	return gulp.src(source)
		.pipe(browserify(browserifySettings))
		.pipe(uglify())
		.pipe(rename(function(path) {
			path.basename += '.' + pkg.version + '.min';
		}))
		.pipe(gulp.dest('./dist'));
});

// Copy
gulp.task('copy', function() {
	var pkg = getPackageJson();

	return gulp.src(source)
		.pipe(browserify(browserifySettings))
		.pipe(gulp.dest('./dist'))
		.pipe(rename(function(path) {
			path.basename += '.' + pkg.version;
		}))
		.pipe(gulp.dest('./dist'));
});

// Cleans the dist folder
gulp.task('clean', function(cb) {
	return del(['./dist', './examples/*.js'], cb);
});

// Build is default task
gulp.task('default', ['copy', 'uglify']);