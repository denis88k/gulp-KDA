import dartSass from 'sass'
import gulpSass from 'gulp-sass'
const scss = gulpSass(dartSass)
import concat from 'gulp-concat'
import group_media_css from 'gulp-group-css-media-queries' // объединяет все схожие media запросы
import autoprefixer from 'gulp-autoprefixer'
// вместо concat стоит применить rename

export const css = () => {
   return app.src(app.path.src.css, { sourcemaps: app.isDev })
      .pipe(app.plugins.plumber(
         app.plugins.notify.onError({
            title: "SCSS",
            message: "Error: <%= error.message %>"
         })
      ))
      .pipe(scss(
         { outputStyle: 'compressed' } // сжатая версия
      ))
      // .pipe(scss(
      //    { outputStyle: 'expanded' } // не сжатая версия
      // ))
      // .pipe(concat('style.css'))
      .pipe(concat('style.min.css'))
      .pipe(app.plugins
         .if(app.isBuild, group_media_css()))
      .pipe(app.plugins
         .if(app.isBuild,
            autoprefixer({
               grid: true,
               overrideBrowserslist: ["last 3 versions"],
               cascade: true
            })
         )
      )
      .pipe(app.dest(app.path.build.css, { sourcemaps: '.' }))
      .pipe(app.plugins.browserSync.stream())
}