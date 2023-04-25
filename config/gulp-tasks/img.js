import imagemin from 'gulp-imagemin'
import webp from 'gulp-webp'

export const images = () => {
   return app.src(app.path.src.img)
      .pipe(app.plugins.plumber(
         app.plugins.notify.onError({
            title: "IMG",
            message: "Error: <%= error.message %>"
         })
      ))
      .pipe(app.plugins.newer(path.build.img))
      .pipe(webp({
         quality: 86
      }))
      .pipe(app.dest(app.path.build.img))
      .pipe(app.src(app.path.src.img))
      .pipe(app.plugins.newer(app.path.build.img))
      .pipe(app.plugins
         .if(isBuild,
            imagemin([
               imagemin.gifsicle({ interlaced: true }),
               imagemin.mozjpeg({ quality: 80, progressive: true }),
               imagemin.optipng({ optimizationLevel: 2 })
            ])
         ))
      .pipe(app.dest(app.path.build.img))
}