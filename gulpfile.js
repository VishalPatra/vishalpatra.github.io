const gulp = require('gulp');
const sass = require('gulp-sass');
const csso = require('gulp-csso');
const uglify = require('gulp-uglify');
const concat = require('gulp-concat');
const plumber = require('gulp-plumber');
const browserSync = require('browser-sync').create();
const imagemin = require('gulp-imagemin');

// Compile SCSS
gulp.task('scss', () => {
	return gulp.src('src/scss/**/*.scss')
		.pipe(plumber())
		.pipe(sass())
		.pipe(csso())
		.pipe(gulp.dest('assets/css/'))
		.pipe(browserSync.stream());
});

// Compile JavaScript
gulp.task('js', () => {
	return gulp.src('src/js/**/*.js')
		.pipe(plumber())
		.pipe(concat('main.js'))
		.pipe(uglify())
		.pipe(gulp.dest('assets/js/'))
		.pipe(browserSync.stream());
});

// Optimize Images
gulp.task('images', () => {
	return gulp.src('src/img/**/*')
		.pipe(imagemin())
		.pipe(gulp.dest('assets/img'));
});

// Watch files
gulp.task('serve', () => {
	browserSync.init({
		server: "./"
	});

	gulp.watch('src/scss/**/*.scss', gulp.series('scss'));
	gulp.watch('src/js/**/*.js', gulp.series('js'));
	gulp.watch('*.html').on('change', browserSync.reload);
});

// Build task
gulp.task('build', gulp.parallel('scss', 'js', 'images'));

// Default task
gulp.task('default', gulp.series('build', 'serve'));
