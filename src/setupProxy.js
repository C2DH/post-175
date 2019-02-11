const proxy = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(proxy('/api', {
    target: 'https://luxptt.dhlab.lu/',
    changeOrigin: true,
  }));
  app.use(proxy('/media', {
    target: 'https://luxptt.dhlab.lu/',
    changeOrigin: true,
  }));
};
