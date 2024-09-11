/* eslint-disable no-undef */
const fs = require('fs');

// const buildProfile = process.env.EAS_BUILD_PROFILE;
const googleServicesJson = process.env.GOOGLE_SERVICES_JSON;
const googleServicesInfo = process.env.GOOGLE_SERVICES_INFO;

// const config = buildProfile === 'production' ? configProd : configDevelop;

console.log(
  'Creating Google Services JSON and Info files...',
  googleServicesJson,
  googleServicesInfo,
);

const decodedGoogleServicesJson = Buffer.from(googleServicesJson, 'base64').toString();
const decodedGoogleServiceInfo = Buffer.from(googleServicesInfo, 'base64').toString();

fs.writeFileSync('./assets/firebase/google-services.json', decodedGoogleServicesJson);
fs.writeFileSync('./assets/firebase/GoogleService-Info.plist', decodedGoogleServiceInfo);

console.log('Google Services JSON and Info files have been created');
