const { withIosGtm } = require('./ios/with-gtm');

module.exports = function withPlugins(config, props) {
  config = withIosGtm(config);

  return config;
};
