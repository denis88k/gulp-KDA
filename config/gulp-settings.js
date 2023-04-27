// Получаем имя папки проекта в которой работаем
import * as nodePath from 'path'
const projectFolder = nodePath.basename(nodePath.resolve())
// папка с исходниками
const sourceFolder = './src'

export const path = {
  src: {
    html: [sourceFolder + '/html/*.html', '!' + sourceFolder + '/html/_*.html'],
    css: sourceFolder + '/scss/style.scss',
    js: sourceFolder + '/js/main.js',
    img: [sourceFolder + '/img/**/*.{jpg,jpeg,png,gif,ico,webp}', '!' + sourceFolder + '/img/svg/**/*.svg'],
    svg: [sourceFolder + '/img/svg/**/*.svg'],
    fonts: sourceFolder + '/fonts/*.*',
    files: sourceFolder + '/files/*.*',
  },
  build: {
    html: projectFolder + '/',
    css: projectFolder + '/css/',
    js: projectFolder + '/js/',
    img: projectFolder + '/img/',
    fonts: projectFolder + '/fonts/',
    files: projectFolder + '/files/',
  },
  watch: {
    html: sourceFolder + '/html/**/*.html',
    css: sourceFolder + '/scss/**/*.scss',
    js: sourceFolder + '/js/**/*.js',
    img: sourceFolder + '/img/**/*.{jpg,jpeg,png,gif,ico,webp}',
    svg: [sourceFolder + '/img/svg/**/*.svg'],
    files: sourceFolder + '/files/*.*',
  },
  clean: projectFolder,
  buildFolder: projectFolder,
  sourceFolder: sourceFolder,
}
