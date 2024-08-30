const { withAndroidQueries } = require('./android/with-queries.js');
const { withIosGtm } = require('./ios/with-gtm.js');

module.exports = function withPlugins(config, props) {
  config = withIosGtm(config);
  config = withAndroidQueries(config);

  return config;
};
