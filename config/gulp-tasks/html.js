import fileinclude from 'gulp-file-include' // объединение html файлов написанных через _*.html(нижнее подчеркивание)
import webpHtmlNosvg from 'gulp-webp-html-nosvg' //добавляет вместо img тэг picture(img. source) с основным форматом и с форматом webp
import typograf from 'gulp-typograf' // для исправления типографических ошибок, переносов и тд
import versionNumber from 'gulp-version-number' // для добавления кэша на css и js

export const html = () => {
  return app
    .src(app.path.src.html)
    .pipe(
      app.plugins.plumber(
        app.plugins.notify.onError({
          title: 'HTML',
          message: 'Error: <%= error.message %>',
        }),
      ),
    )
    .pipe(app.plugins.newer(app.path.build.html))
    .pipe(
      fileinclude({
        prefix: '@',
        basepath: '@file',
      }),
    )
    .pipe(webpHtmlNosvg())
    .pipe(
      typograf({
        locale: ['ru', 'en-US'],
      }),
    )
    .pipe(
      app.plugins.if(
        app.isCache,
        versionNumber({
          value: '%DT%',
          append: {
            key: '_v',
            cover: 0,
            to: ['css', 'js', 'img'],
          },
          output: {
            file: 'config/version.json',
          },
        }),
      ),
    )
    .pipe(dest(path.build.html))
    .pipe(app.plugins.browserSync.stream())
}
