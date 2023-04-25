Gulp - сборка KDA
Gulp 4

html - components
css - scss, mixins
img - min,webp,svgSprite
js - min
fonts - ....

Команды:
npm i - установка всех зависимостей, находящихся в package.json
gulp - базовая команда, которая запускает сборку для разработки, используя browser-sync
gulp build - команда для продакшн-сборки проекта. Все ассеты сжаты и оптимизированы для выкладки на хостинг.

npm run dev
npm run build

!!!!"html": "node-w3c-validator -f lint -evH -i app/**/*.html", - здесь будет не папка app, а название проекта

npm i gulp-cli -g
npm i -D gulp
npm i -D gulp-file-include
npm i -D del
npm i -D gulp-typograf
npm i -D gulp-if
npm i -D gulp-sass
npm i -D gulp-autoprefixer
npm i -D browser-sync
npm i -D gulp-concat
npm i -D gulp-newer
npm i -D gulp-imagemin
npm i -D gulp-svg-sprite
npm i -D gulp-svg-sprite
npm i -D gulp-group-css-media-queries
npm i -D gulp-webp
npm i -D gulp-webp-html-nosvg
npm i -D gulp-plumber
npm i -D gulp-if
npm i -D gulp-fonter
npm i -D gulp-ttf2woff2
npm i -D gulp-svgmin
npm i -D gulp-version-number
npm i -D gulp-zip
