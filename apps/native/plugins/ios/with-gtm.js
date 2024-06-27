const { withDangerousMod, IOSConfig, XML } = require('expo/config-plugins');
const { isNotProdBuild } = require('../util');

async function readSchemeAsync(projectRoot, scheme) {
  const allSchemePaths = IOSConfig.Paths.findSchemePaths(projectRoot);
  const re = new RegExp(`/${scheme}.xcscheme`, 'i');
  const schemePath = allSchemePaths.find(i => re.exec(i));
  if (schemePath) {
    return await XML.readXMLAsync({ path: schemePath });
  } else {
    throw new Error(`scheme '${scheme}' does not exist, make sure it's marked as shared`);
  }
}

async function writeSchemeAsync(projectRoot, scheme, xml) {
  const allSchemePaths = IOSConfig.Paths.findSchemePaths(projectRoot);
  const re = new RegExp(`/${scheme}.xcscheme`, 'i');
  const schemePath = allSchemePaths.find(i => re.exec(i));
  if (schemePath) {
    return await XML.writeXMLAsync({ path: schemePath, xml });
  } else {
    throw new Error(`scheme '${scheme}' does not exist, make sure it's marked as shared`);
  }
}

async function updateLaunchScheme(config) {
  const schemeXML = await readSchemeAsync(config.modRequest.projectRoot, 'cococom');
  const launchActionEntry = schemeXML.Scheme?.LaunchAction[0];
  const debugModeCLArgument = {
    CommandLineArgument: {
      $: {
        argument: '-FIRDebugEnabled',
        isEnabled: 'YES',
      },
    },
  };

  launchActionEntry.CommandLineArguments = [debugModeCLArgument];

  await writeSchemeAsync(config.modRequest.projectRoot, 'cococom', schemeXML);
}

module.exports.withIosGtm = config => {
  // for preview : https://developers.google.com/tag-platform/tag-manager/ios/v5#preview_container
  if (isNotProdBuild(config)) {
    config = withDangerousMod(config, [
      'ios',
      async props => {
        await updateLaunchScheme(props);
        return props;
      },
    ]);
  }

  return config;
};
