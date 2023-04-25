// Импорт основного модуля
import { gulp, src, dest, watch, parallel, series } from "gulp"
// Импорт общих плагинов
import { plugins } from "./config/gulp-plugins.js"
// Импорт путей
import { path } from "./config/gulp-settings.js"

// Передаем значения в глобальную переменную
global.app = {
	isBuild: process.argv.includes('--build'),
	isDev: process.argv.includes('--dev'),
	isCache: process.argv.includes('--cache'),
	src,
	dest,
	gulp,
	path,
	plugins
}

// Импорт задач
import { copy } from "./config/gulp-tasks/copy.js"
import { del } from "./config/gulp-tasks/reset.js"
import { html } from "./config/gulp-tasks/html.js"
import { server } from "./config/gulp-tasks/server.js"
import { css } from "./config/gulp-tasks/css.js"
import { js } from "./config/gulp-tasks/js.js"
import { img } from "./config/gulp-tasks/images.js"
import { svgSprite } from "./config/gulp-tasks/svgSprite.js"
import { zip } from "./config/gulp-tasks/zip.js"
import { otfToTtf, ttfToWoff, fonstStyle } from "./config/gulp-tasks/fonts.js"

// наблюдает за изменениями в файлах
const watcher = () => {
	watch(path.watch.html, html)
	watch(path.watch.css, css)
	watch(path.watch.js, js)
	watch(path.watch.img, img)
	watch(path.watch.svg, svg)
	watch(path.watch.files, copy)
}

// Последовательная обработка шрифтов
const fonts = series(otfToTtf, ttfToWoff, fonstStyle)

// основные задачи
const mainTasks = series(fonts, parallel(copy, html, css, js, img, svgSprite))

// сценарий разработки
const devTasks = series(del, mainTasks, parallel(watcher, server))
const buildTasks = series(del, mainTasks)
const zipTasks = series(buildTasks, zip)

// Основные задачи будем выполнять параллельно после обработки шрифтов
// const devTasks = parallel(del, copy, fonts)
// Основные задачи будем выполнять параллельно после обработки шрифтов

// Экспорт задач
export { html }
export { css }
export { js }
export { images }
export { fonts }
export { sprite }
export { zip }

// Экспорт сценариев
export { devTasks }
export { buildTasks }

// Выполнение сценария по умолчанию
exports.default = series(devTasks)
exports.build = series(buildTasks)
exports.zip = series(zipTasks)
