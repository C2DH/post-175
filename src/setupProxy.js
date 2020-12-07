const proxy = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(proxy('/api', {
    target: process.env.REACT_APP_PROXY_URL || 'http://localhost',
    changeOrigin: true,
  }));
  app.use(proxy('/media', {
    target: process.env.REACT_APP_PROXY_URL || 'http://localhost',
    changeOrigin: true,
  }));
};
