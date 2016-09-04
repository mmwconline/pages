"use strict";

var gulp      = require('gulp'),
		jshint    = require('gulp-jshint'),
		debug     = require('gulp-debug'),
		util      = require('gulp-util'),
		json      = require('gulp-json-transform'),
		path      = require('path'),
		Promise   = require('promise'),
		es        = require('event-stream'),
		plumber   = require('gulp-plumber'),

		// JS BUILD
		concat    = require('gulp-concat'),
		uglify    = require('gulp-uglify'),

		// HTML
		htmlmin   = require('gulp-htmlmin'),
		injectStr = require('gulp-inject-string'),

		// CSS
		cssmin = require('gulp-clean-css');

var config = {
	src: {
		sharedjs: [
			'_src/assets/plugins/jquery/jquery-2.2.3.min.js',
			'_src/assets/plugins/bootstrap/js/bootstrap.min.js',
			'_src/assets/js/scripts.js'
		],
		js: [
			'_src/**/*.js',
			'!_src/assets/js/view/*.js',
			'!_src/assets/js/scripts.js',
			'!_src/assets/plugins/**/*.js'],
		css: '_src/assets/css/**/*.css',
		html: [
			'_src/**/*.html',
			'!_src/assets/**/*.html'
		],
		sharedcss: [
			'_src/assets/plugins/bootstrap/css/bootstrap.min.css',
			'_src/assets/css/font-awesome.min.css',
			'_src/assets/css/essentials.css',
			'_src/assets/css/layout.css',
			'_src/assets/css/plugin-hover-buttons.css',
			'_src/assets/css/header-1.css',
			'_src/assets/css/color_scheme/red.css'
		],
		jekyll: ['_config.yml'],
		pageAssetsConfig: '_src/_data/asset-config/**/*.json',
		others: [
			'_src/_data/**/*.+(yaml|yml|csv)',
			'_src/_posts/*'
		]
	},
	dest: {
		sharedcss: 'assets/css/',
		sharedjs: 'assets/js/',
		pageAssetsConfig: '_data/asset-config/',
		pagejs: 'assets/js/pages/',
		pagecss: 'assets/css/pages/',
		others: '.'
	},
	names: {
		sharedjs: 'common.min.js',
		sharedcss: 'common.min.css'
	}
};



gulp.task('default', ['jshint', 'shared-js', 'shared-css', 'page-asset-config', 'others', 'html', 'jekyll', 'watch']);

gulp.task('watch', function() {
	gulp.watch(config.src.js, ['jshint', 'page-asset-config']);
	gulp.watch(config.src.css, ['page-asset-config']);
	gulp.watch(config.src.pageAssetsConfig, ['page-asset-config', 'html']);
	gulp.watch(config.src.sharedjs, ['shared-js']);
	gulp.watch(config.src.sharedcss, ['shared-css']);
	gulp.watch(config.src.others, ['others']);
	gulp.watch(config.src.html, ['html']);
});

gulp.task('jshint', function () {
	return gulp
		.src(config.src.js)
		.pipe(jshint())
		.pipe(jshint.reporter('jshint-stylish'));
});

gulp.task('shared-css', function() {
	return cssMinifyStream(config.src.sharedcss, config.names.sharedcss, config.dest.sharedcss);
});

gulp.task('shared-js', function() {
	return jsMinifyStream(config.src.sharedjs, config.names.sharedjs, config.dest.sharedjs);
});

gulp.task('page-asset-config', function() {
	return gulp
		.src(config.src.pageAssetsConfig)
		.pipe(plumber())
		.pipe(json(transformConfigAndCreatePageAssets))
		.pipe(gulp.dest(config.dest.pageAssetsConfig))
		.on('error', function(e) { util.log(e); this.end(); });
});

gulp.task('others', function() {
	return gulp
		.src(config.src.others, {base: './_src'})
		.pipe(gulp.dest(config.dest.others));
});


gulp.task('html', function() {
	return gulp
		.src(config.src.html)
		.pipe(htmlmin({
			collapseWhitespace: true,
			removeComments: true,
			caseSensitive: true,
			ignoreCustomFragments: [
				/<%[\s\S]*?%>/,
				/<\?[\s\S]*?\?>/,
				/---[\s\S]*?---/
			]
		}))
		.pipe(injectStr.after('\n---','\n'))
		.pipe(gulp.dest('.'))
});


gulp.task('jekyll', function (gulpCallBack) {
	var spawn = require('child_process').spawn;
	var jekyll = spawn('jekyll', ['build'], {stdio: 'inherit'});

	jekyll.on('exit', function(code) {
		gulpCallBack(code === 0 ? null : 'ERROR: Jekyll process exited with code: '+code);
	});
});

function jsMinifyStream(srcGlob, filename, destDir) {
	return gulp
		.src(srcGlob)
		.pipe(concat(filename))
		.pipe(uglify())
		.pipe(gulp.dest(destDir));
}
function cssMinifyStream(srcGlob, filename, destDir) {
	return gulp
		.src(srcGlob)
		.pipe(concat(filename))
		.pipe(cssmin())
		.pipe(gulp.dest(destDir));
}
function transformConfigAndCreatePageAssets(jsonConfig, fileInfo) {
	jsonConfig.js = jsonConfig.js || [];
	jsonConfig.css = jsonConfig.css || [];

	var filename = path.posix.basename(fileInfo.path, '.json');
	var minJS = filename + '.min.js';
	var minCSS = filename + '.min.css';
	var newJsonFile = prepareJsonFile(jsonConfig);

	jsonConfig.js = jsonConfig.js.filter(function(p) { return p.indexOf('http') !== 0; });
	jsonConfig.css = jsonConfig.css.filter(function(p) { return p.indexOf('http') !== 0; });

	return new Promise(function(resolve, reject) {
		var jsStream = jsMinifyStream(jsonConfig.js, minJS, config.dest.pagejs);
		var cssStream = cssMinifyStream(jsonConfig.css, minCSS, config.dest.pagecss);

		es.merge(jsStream, cssStream)
			.on('end', function () {
				if (jsonConfig.js && jsonConfig.js.length)
					newJsonFile.js.push(config.dest.pagejs + minJS);
				if (jsonConfig.css && jsonConfig.css.length)
					newJsonFile.css.push(config.dest.pagecss + minCSS);
				resolve(newJsonFile);
			})
			.on('error', function(error) {
				reject(error);
			});
	});
}
function prepareJsonFile(data) {
	var json = {
		js: [],
		css: [],
		jsLinks: [],
		cssLinks: []
	};
	json.jsLinks = data.js.filter(function(p) { return p.indexOf('http') === 0; });
	json.cssLinks = data.css.filter(function(p) { return p.indexOf('http') === 0; });

	if (data.usesShared) {
		json.js.push(config.dest.sharedjs + config.names.sharedjs);
		json.css.push(config.dest.sharedcss + config.names.sharedcss);
	}

	return json;
}