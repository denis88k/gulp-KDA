export const browsersync = () => {
  app.plugins.browserSync.init({
    server: {
      baseDir: `./${projectFolder}/`,
    },
    notify: true,
    port: 3000,
  });
};
