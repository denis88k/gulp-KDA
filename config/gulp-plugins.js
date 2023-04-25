// Импортируем модули
import notify from "gulp-notify" // вывод уведомление об ошибках
import newer from "gulp-newer" // проверяет обновление файлов
import plumber from "gulp-plumber" // не выбивает работу gulp если обнаружится ошибка, а покажет её
import ifPlugin from "gulp-if" // выполнение действия при определённых условиях
import browserSync from 'browser-sync'
import prettier from "gulp-prettier" //??
// import rename from 'gulp-rename';

// Экспортируем объект
export const plugins = {
   notify,
   if: ifPlugin,
   prettier,
   newer,
   plumber,
   browserSync,
   // rename
}