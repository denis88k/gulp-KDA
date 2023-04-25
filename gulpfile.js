import * as nodePath from 'path'
const projectFolder = nodePath.basename(nodePath.resolve()) //название папки в которой осуществляется работа
const sourceFolder = './src'

const path = {
	src: {
		html: [sourceFolder + '/html/*.html', '!' + sourceFolder + '/html/_*.html'],
		css: sourceFolder + '/scss/style.scss',
		js: sourceFolder + '/js/main.js',
		img: [sourceFolder + '/img/**/*.{jpg,jpeg,png,gif,ico,webp}', '!' + sourceFolder + '/img/svg/*.svg'],
		svg: [sourceFolder + '/img/svg/*.svg'],
		fonts: sourceFolder + '/fonts/*',
	},
	build: {
		html: projectFolder + '/',
		css: projectFolder + '/css/',
		js: projectFolder + '/js/',
		img: projectFolder + '/img/',
		fonts: projectFolder + '/fonts/',
	},
	watch: {
		html: sourceFolder + '/html/**/*.html',
		css: sourceFolder + '/scss/**/*.scss',
		js: sourceFolder + '/js/**/*.js',
		img: sourceFolder + '/img/**/*.{jpg,jpeg,png,gif,ico,webp,svg}',
	}
}

// const { src, dest, watch, parallel, series } = require('gulp')

// const browserSync = require('browser-sync').create()
// const del = require('del')
// const autoprefixer = require('gulp-autoprefixer')
// const concat = require('gulp-concat')
// const newer = require('gulp-newer')
// const imagemin = require('gulp-imagemin')
// const webp = require('gulp-webp')
// const scss = require('gulp-sass')(require('sass'))
// const uglify = require('gulp-uglify-es').default
// const webpHtmlNosvg = require('gulp-webp-html-nosvg')
// const svgSprite = require('gulp-svg-sprite')
// const fileinclude = require('gulp-file-include')

import { dest, watch, parallel, series } from 'gulp'

import browserSync from 'browser-sync'
const browserSyncStream = browserSync.create().stream()
import del from 'del'
import autoprefixer from 'gulp-autoprefixer'
import concat from 'gulp-concat'
import fileinclude from 'gulp-file-include' //html
import group_media_css from 'gulp-group-css-media-queries' // объединяет все схожие media запросы
import gulpif from 'gulp-if'
import imagemin from 'gulp-imagemin'
import newer from 'gulp-newer' // проверка обновления
import plumber from 'gulp-plumber' // обработка ошибок
import dartSass from 'sass'
import gulpSass from 'gulp-sass'
const scss = gulpSass(dartSass)
// import uglify from 'gulp-uglify-es'
import svgSprite from 'gulp-svg-sprite'
import typograf from 'gulp-typograf'
import webp from 'gulp-webp'
import webpHtmlNosvg from 'gulp-webp-html-nosvg'
import webpackStream from 'webpack-stream'


let isProd = false

const toProd = (done) => {
	isProd = true
	done()
}

const browsersync = () => {
	browserSync.create().init({
		server: {
			baseDir: `./${projectFolder}/`
		}
	})
	watch([path.watch.html], html)
	watch([path.watch.css], styles)
	watch([path.watch.js], scripts)
	watch([path.watch.img], images)
}

const cleanDist = () => {
	return del(`./${projectFolder}/*`
		// , `${path.build.img}`
	)
	// разобраться с удалением
}

const html = () => {
	return src(path.src.html)
		.pipe(plumber(
			notify.onError({
				title: "HTML",
				message: "Error: <%= error.message %>"
			})
		))
		// проверить работоспособность данного плагина в других функциях
		.pipe(newer(path.build.html))
		.pipe(fileinclude({
			prefix: '@',
			basepath: '@file'
		}))
		.pipe(webpHtmlNosvg())
		.pipe(typograf({
			locale: ['ru', 'en-US']
		}))
		.pipe(dest(path.build.html))
		.pipe(browserSyncStream())
}

const styles = () => {
	return src(path.src.css, { sourcemaps: !isProd })
		.pipe(plumber(
			notify.onError({
				title: "SCSS",
				message: "Error: <%= error.message %>"
			})
		))
		.pipe(scss(
			{ outputStyle: 'compressed' }
		))
		.pipe(concat('style.min.css'))
		.pipe(group_media_css())
		.pipe(autoprefixer({
			cascade: false,
			grid: 'autoplace',
			overrideBrowserslist: ['last 10 version']
		}))
		.pipe(dest(path.build.css, { sourcemaps: '.' }))
		.pipe(browserSyncStream())
}

const scripts = () => {
	return src(path.src.js)
		.pipe(plumber(
			notify.onError({
				title: "JS",
				message: "Error: <%= error.message %>"
			})
		))
		.pipe(webpackStream({
			mode: isProd ? 'production' : 'development',
			output: {
				filename: 'main.js',
			},
			module: {
				rules: [{
					test: /\.m?js$/,
					exclude: /node_modules/,
					use: {
						loader: 'babel-loader',
						options: {
							presets: [
								['@babel/preset-env', {
									targets: "defaults"
								}]
							]
						}
					}
				}]
			},
			devtool: !isProd ? 'source-map' : false
		}))
		.on('error', function (error) {
			console.error('WEBPACK ERROR', error)
			this.emit('end')
		})
		.pipe(dest(path.build.js))
		.pipe(browserSyncStream())
}

const images = () => {
	return src(path.src.img)
		.pipe(plumber(
			notify.onError({
				title: "IMG",
				message: "Error: <%= error.message %>"
			})
		))
		.pipe(newer(path.build.img))
		.pipe(webp({
			quality: 86
		}))
		.pipe(dest(path.build.img))
		.pipe(src(path.src.img))
		.pipe(newer(path.build.img))
		.pipe(gulpif(isProd,
			imagemin([
				imagemin.gifsicle({ interlaced: true }),
				imagemin.mozjpeg({ quality: 80, progressive: true }),
				imagemin.optipng({ optimizationLevel: 2 })
			])
		))
		.pipe(dest(path.build.img))
}

const svgSprites = () => {
	return src(path.src.svg)
		.pipe(plumber(
			notify.onError({
				title: "SVG",
				message: "Error: <%= error.message %>"
			})
		))
		.pipe(
			svgmin({
				js2svg: {
					pretty: true,
				},
			})
		)
		// .pipe(
		// 	cheerio({
		// 		run: function ($) {
		// 			$('[fill]').removeAttr('fill')
		// 			$('[stroke]').removeAttr('stroke')
		// 			$('[style]').removeAttr('style')
		// 		},
		// 		parserOptions: {
		// 			xmlMode: true
		// 		},
		// 	})
		// )
		.pipe(svgSprite({
			mode: {
				// symbol: {
				stack: {
					sprite: './../sprite.svg'
				}
			}
		}))
		.pipe(dest(path.build.img))
}

const fonts = () => {
	return src('src/fonts/**/*')
		.pipe(dest('app/fonts'))
}

// exports.default = series(cleanDist, html, styles, scripts, svgSprites, images, fonts, browsersync)
exports.default = series(cleanDist, parallel(html, styles, scripts, images, svgSprites, fonts), parallel(browsersync))
exports.build = series(toProd, cleanDist, html, styles, scripts, images, svgSprites, fonts)