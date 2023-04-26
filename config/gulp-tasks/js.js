import webpackStream from 'webpack-stream'
import uglify from 'gulp-uglify-es'

export const scripts = () => {
   return app.src(app.path.src.js)
      .pipe(app.plugins.plumber(
         app.plugins.notify.onError({
            title: "JS",
            message: "Error: <%= error.message %>"
         })
      ))
      .pipe(webpackStream({
         mode: app.isBuild ? 'production' : 'development',
         output: {
            filename: 'main.min.js',
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
         devtool: app.isDev ? 'source-map' : false
      }))
      .on('error', function (error) {
         console.error('WEBPACK ERROR', error)
         this.emit('end')
      })
      .pipe(app.plugins.if(app.isBuild, uglify()
         .on('error',
            app.plugins.notify.onError({
               title: "uglify",
               message: "Error: <%= error.message %>"
            })
         )
      ))
      .pipe(dest(app.path.build.js))
      .pipe(app.plugins.browserSync.stream())
}