const { withIosGtm } = require('./ios/with-gtm.js');

module.exports = function withPlugins(config, props) {
  config = withIosGtm(config);

  return config;
};
