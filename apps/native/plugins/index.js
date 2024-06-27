const { withIosGtm } = require('./ios/with-gtm');

module.exports = function withSodaGift(config, props) {
  config = withIosGtm(config);

  return config;
};
