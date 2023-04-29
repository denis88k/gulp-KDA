// Импорт основного модуля
import { dest, gulp, parallel, series, src, watch } from 'gulp';

// Импорт общих плагинов
import { plugins } from './config/gulp-plugins.js';
// Импорт путей
import { path } from './config/gulp-settings.js';

// Передаем значения в глобальную переменную
global.app = {
  isBuild: process.argv.includes('--build'),
  isDev: process.argv.includes('--dev'),
  isCache: process.argv.includes('--cache'),
  src,
  dest,
  path,
  plugins,
};

// Импорт задач
import { copy } from './config/gulp-tasks/copy.js';
import { css } from './config/gulp-tasks/css.js';
import { reset } from './config/gulp-tasks/del.js';
import { fontsStyle, otfToTtf, ttfToWoff } from './config/gulp-tasks/fonts.js';
import { html } from './config/gulp-tasks/html.js';
import { img } from './config/gulp-tasks/img.js';
import { js } from './config/gulp-tasks/js.js';
import { server } from './config/gulp-tasks/server.js';
import { svgSprites } from './config/gulp-tasks/svgSprite.js';
import { zip } from './config/gulp-tasks/zip.js';

// наблюдает за изменениями в файлах
const watcher = () => {
  watch(path.watch.html, html);
  watch(path.watch.css, css);
  watch(path.watch.js, js);
  watch(path.watch.img, img);
  watch(path.watch.svg, svgSprites);
  watch(path.watch.files, copy);
};

// Последовательная обработка шрифтов
const fonts = series(otfToTtf, ttfToWoff, fontsStyle);

// основные задачи
const mainTasks = series(fonts, parallel(copy, html, css, js, img, svgSprites));

// сценарий разработки
const devTasks = series(reset, mainTasks, parallel(watcher, server));
const buildTasks = series(reset, mainTasks);
const zipTasks = series(buildTasks, zip);

// Основные задачи будем выполнять параллельно после обработки шрифтов
// const devTasks = parallel(del, copy, fonts)
// Основные задачи будем выполнять параллельно после обработки шрифтов

// Экспорт задач
export { html };
export { css };
export { js };
export { img };
export { fonts };
export { svgSprites };
export { zip };
// Экспорт сценариев
export { devTasks };
export { buildTasks };

// Выполнение сценария по умолчанию
exports.default = series(devTasks);
exports.build = series(buildTasks);
exports.zip = series(zipTasks);
