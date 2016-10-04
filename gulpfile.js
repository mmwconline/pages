"use strict";

var gulp          = require('gulp'),
		eslint        = require('gulp-eslint'),
		chalk         = require('chalk'),
// outputs the file it is processing if you add .pipe(debug())
		debug         = require('gulp-debug'),
	// allows you to do util.log(msg), do .pipe(someCondition ? somePlugin : util.noop()),
	// replaceExtension, etc.
		util          = require('gulp-util'),
	//allows you to pipe json files, then transform em and put it somewhere
	// best plugin ever!
		jsonTransform = require('gulp-json-transform'),
	// find name of file given its path and extension
		path          = require('path'),
	// need it for gulp-json-transform, which allows you to return a Promise that'll
	// return the transformed json
		Promise       = require('promise'),
	// very powerful. Allows you to transform streams, MERGE streams, which is what
	// we care about
		es            = require('event-stream'),
	// when a stream errors out, the task no longer works. this solves this problem.
	// See Error Management in OneNote
		plumber       = require('gulp-plumber'),

		// JS BUILD
	// combine multiple js/css files into one, in the ordered they were added
		concat        = require('gulp-concat'),
		uglify        = require('gulp-uglify'), // minify js files
		newer         = require('gulp-newer'),

		// HTML
		htmlmin       = require('gulp-htmlmin'), // minify html files
		injectStr     = require('gulp-inject-string'), // add strings anywhere you want, based on conditions, etc.

		// CSS
		cssmin        = require('gulp-clean-css'), // minify css files

		// IMAGES
		imagemin  = require('gulp-imagemin'),  // optimize images

		// REACT BROWSERIFY AND BABEL
		browserify    = require('browserify'),
		source        = require('vinyl-source-stream'),
		errorify      = require('errorify'),
		buffer        = require('vinyl-buffer'),
		watchify      = require('watchify'),
		babelify      = require('babelify');

var config = {
	src: {
		sharedjs: [
			'_src/assets/plugins/jquery/jquery-2.2.3.min.js',
			'_src/assets/plugins/bootstrap/js/bootstrap.min.js',
			'_src/assets/js/scripts.js'
		],
		sharedcss: [
			'_src/assets/plugins/bootstrap/css/bootstrap.min.css',
			'_src/assets/css/essentials.css',
			'_src/assets/css/layout.css',
			'_src/assets/css/plugin-hover-buttons.css',
			'_src/assets/css/header-1.css',
			'_src/assets/css/color_scheme/red.css'
		],
		// only for linting, and to call pageAssetConfig task
		eslint: [
			'_src/**/*.js?', // so it matches .jsx files also
			'!_src/assets/js/view/*.js',
			'!_src/assets/js/scripts.js',
			'!_src/assets/plugins/**/*.js',
			'!_src/assets/js/browserify-bundles/**/*.js'
		],
		pagejs: [
			'_src/**/*.js',
			'!_src/assets/js/view/*.js',
			'!_src/assets/js/scripts.js',
			'!_src/assets/plugins/**/*.js',
			'!_src/assets/js/timeline/*.js'
		],
		browserify: './_src/assets/js/timeline/entry.jsx',
		// only used to trigger pageAssetConfig task
		pagecss: '_src/assets/css/**/*.css',
		html: [
			'_src/**/*.html',
			'!_src/assets/**/*.html'
		],
		jekyll: ['_config.yml'],
		pageAssetsConfig: '_src/_data/asset-config/**/*.json',
		// no processing for these files, so just move em over to dest
		others: [
			'_src/_data/**/*.+(yaml|yml|csv)',
			'_src/_posts/*'
		],
		images: [
			'_src/assets/images/**/*'
		]
	},
	dest: {
		sharedcss: 'assets/css/',
		sharedjs: 'assets/js/',
		pageAssetsConfig: '_data/asset-config/',
		pagejs: 'assets/js/pages/',
		pagecss: 'assets/css/pages/',
		others: '.',
		images: 'assets/images/',
		browserify: '_src/assets/js/browserify-bundles/'
	},
	names: {
		sharedjs: 'common.min.js',
		sharedcss: 'common.min.css',
		timeline: 'timeline.js'
	},
	browserify: {

	}
};
gulp.task('default-with-watch', ['default', 'browserify-watchify', 'watch']);
gulp.task('prod-watch', ['apply-prod-env', 'default-with-watch']);

// runs these gulp tasks in the order they're listed, but in parallel, unless
// one depends on another task
gulp.task('default', [
	'eslint',
	'browserify',
	'shared-js',
	'shared-css',
	// 'page-js', // will run from the browserify-watch task anyways
	'page-css',
	'page-asset-config',
	'others',
	'images',
	'html',
	'jekyll'
]);

gulp.task('apply-prod-env', function() {
	process.env.NODE_ENV = 'production';
});

// page-asset-config is the meat of it. It makes the page.min.css and page.min.js
// files, and the json files for each page
// so jekyll knows where to get all the assets for each page.
gulp.task('watch', function() {
	gulp.watch(config.src.eslint, ['eslint']);
	gulp.watch(config.src.pagejs, ['page-js']);
	gulp.watch(config.src.pagecss, ['page-css']);
	gulp.watch(config.src.pageAssetsConfig, ['page-asset-config', 'html']);
	gulp.watch(config.src.sharedjs, ['shared-js']);
	gulp.watch(config.src.sharedcss, ['shared-css']);
	gulp.watch(config.src.others, ['others']);
	gulp.watch(config.src.jekyll, ['jekyll']);
	gulp.watch(config.src.images, ['images']);
	gulp.watch(config.src.html, ['html']);
});

gulp.task('eslint', function () {
	return gulp
		.src(config.src.eslint)
		.pipe(eslint())
		.pipe(eslint.format());
});

gulp.task('shared-css', function() {
	return cssMinifyStream(config.src.sharedcss, config.names.sharedcss, config.dest.sharedcss);
});

gulp.task('shared-js', function() {
	return jsMinifyStream(config.src.sharedjs, config.names.sharedjs, config.dest.sharedjs);
});

/**
 * Gist of this gulpfile
 * for the json pipe, we could've just done .pipe(json(function(jsonFile, file) { ... })),
 * but this looks much cleaner. In essence, we read in all the json files located in src,
 * make page.min.css and page.min.js files asynchronously using a Promise so gulp knows
 * when it's done, and then return a new json file, that has locations of the minified css and js
 *
 * Why doesn't this depend on shared-js and shared-css? Because it'll run those tasks
 * EVERY TIME page-asset-config wants to run. I thought dependent tasks would only
 * run if anything changed in those dependent tasks. So if a custom js file
 * we wrote changes, we want page-asset-config to run, not shared-js and shared-css.
 */
gulp.task('page-asset-config', function() {
	return gulp
		.src(config.src.pageAssetsConfig)
		// only purpose of plumber() is to not crash the task when json pipe crashes, which happens whenever a new json is
		// added to src directory (an empty json file is an invalid json file)
		.pipe(plumber())
		.pipe(jsonTransform(transformConfig))
		.pipe(gulp.dest(config.dest.pageAssetsConfig));
});
gulp.task('page-js', function () {
	return gulp
		.src(config.src.pageAssetsConfig) // the config files are the files we have to update
		.pipe(plumber())
		.pipe(jsonTransform(createJSPageAssets));
});
gulp.task('page-css', function () {
	return gulp
		.src(config.src.pageAssetsConfig) // the config files are the files we have to update
		.pipe(plumber())
		.pipe(jsonTransform(createCSSPageAssets));
});

// just moves the unprocessed files so it can be consumed by jekyll
gulp.task('others', function() {
	return gulp
		.src(config.src.others, {base: './_src'})
		.pipe(gulp.dest(config.dest.others));
});

gulp.task('images', function() {
	return gulp
		.src(config.src.images)
		.pipe(newer(config.dest.images))
		.pipe(debug())
		.pipe(imagemin())
		.pipe(gulp.dest(config.dest.images));
});
//
gulp.task('html', function() {
	return gulp
		.src(config.src.html)
		.pipe(plumber())
		.pipe(htmlmin({
			collapseWhitespace: true, // if this is false, it keeps the newlines and all the whitespaces! Doesn't even look minified
			removeComments: true,
			caseSensitive: true, // needed for jekyll. {{ page }} is not the same as {{ PAGE }}
			ignoreCustomFragments: [
				/<%[\s\S]*?%>/, // this is the default of ignoreCustomFragments
				/<\?[\s\S]*?\?>/, // also the default of ignoreCustomFragments
				/---[\s\S]*?---/ // we're telling it to ignore the liquid tags in the
				// beginning of the file and everything within them
			]
		}))
		// the last liquid tags (---) is on the same line as the minified html,
		// and jekyll doesn't detect the tags anymore
		// so we need to insert a new line after the second ---
		.pipe(injectStr.after('\n---','\n'))
		.pipe(gulp.dest('.'))
});

gulp.task('browserify-watchify', function() {
	var args = watchify.args;

	var bundler = browserify(config.src.browserify, args)
		.plugin(watchify, { ignoreWatch: true})
		.plugin(errorify)
		.transform(babelify, { presets: ['es2015', 'react']});

	var stream = browserifyMinifyStream(bundler);

	bundler.on('update', function() {
		util.log("Starting '" + chalk.blue("browserify") + "'...");
		return browserifyMinifyStream(bundler);
	});

	bundler.on('time', function(time) {
		var timeStr = (time >= 1000) ? (Math.round( time * 100.0 / 1000) / 100) + ' s' : time + ' ms';
		util.log("Finished '" + chalk.blue("browserify") + "' after " + chalk.magenta(timeStr));
	});

	return stream;
});

gulp.task('browserify', function() {

	var bundler = browserify(config.src.browserify)
		.transform(babelify, { presets: ['es2015', 'react']});

	return browserifyMinifyStream(bundler);
});

// returns a stream for js minification.
function jsMinifyStream(srcGlob, filename, destDir) {
	return gulp
		.src(srcGlob)
		.pipe(newer(destDir + filename))
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
function browserifyMinifyStream(bundler) {

	return bundler
		.bundle()
		.pipe(source(config.names.timeline))
		.pipe(buffer())
		.pipe(uglify()) // already done in the jsMinifyStream
		.pipe(gulp.dest(config.dest.browserify));
}

function transformConfig(json, fileInfo) {
	json.js = json.js || [];
	json.css = json.css || [];

	var filename = path.posix.basename(fileInfo.path, '.json'); // /dir/dir2/index.json would return index
	var minJS = filename + '.min.js';
	var minCSS = filename + '.min.css';
	var newJsonFile = prepareJsonFile(json);

	json.js = json.js.filter(function(p) { return p.indexOf('http') !== 0; });
	json.css = json.css.filter(function(p) { return p.indexOf('http') !== 0; });
	if (json.js && json.js.length)
		newJsonFile.js.push(config.dest.pagejs + minJS);
	if (json.css && json.css.length)
		newJsonFile.css.push(config.dest.pagecss + minCSS);

	return newJsonFile;
}

function transformPageAssetConfig(jsonConfig, fileInfo) {

}
function createJSPageAssets(json, fileInfo) {
	var filename = path.posix.basename(fileInfo.path, '.json'); // /dir/dir2/index.json would return index
	var minJS = filename + '.min.js';

	json.js = (json.js || []).filter(function(p) { return p.indexOf('http') !== 0; });

	return new Promise(function (resolve, reject) {
		jsMinifyStream(json.js, minJS, config.dest.pagejs)
			.on('end', function () {
				resolve({});
			})
			.on('error', function (error) {
				reject(error);
			});
	});
}
function createCSSPageAssets(json, fileInfo) {
	var filename = path.posix.basename(fileInfo.path, '.json'); // /dir/dir2/index.json would return index
	var minCSS = filename + '.min.css';

	json.css = (json.css || []).filter(function(p) { return p.indexOf('http') !== 0; });

	return new Promise(function (resolve, reject) {
		cssMinifyStream(json.css, minCSS, config.dest.pagecss)
			.on('end', function () {
				resolve({});
			})
			.on('error', function (error) {
				reject(error);
			});
	});
}
// puts the remote assets in jsLinks and cssLinks, respectively.
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

// copied and pasted from somewhere. The callback lets gulp know that the task is done.
gulp.task('jekyll', function (gulpCallBack) {
	var spawn = require('child_process').spawn;
	var jekyll = spawn('jekyll', ['build'], {stdio: 'inherit'});

	jekyll.on('exit', function(code) {
		gulpCallBack(code === 0 ? null : 'ERROR: Jekyll process exited with code: '+code);
	});
});