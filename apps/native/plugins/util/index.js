const isNotProdBuild = config => {
  if (!config.version) return false;
  return config.version.split('-').length > 1;
};

module.exports = { isNotProdBuild };
