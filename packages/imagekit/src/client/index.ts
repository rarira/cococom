/* eslint-disable turbo/no-undeclared-env-vars */
import ImageKit from 'imagekit-javascript';
import { TransformationPosition, UrlOptions } from 'imagekit-javascript/dist/src/interfaces';
import { Transformation } from 'imagekit-javascript/dist/src/interfaces/Transformation';

import { config } from './config';

const imagekit = new ImageKit({
  publicKey: config.IMAGEKIT_PUBLIC_KEY,
  urlEndpoint: config.IMAGEKIT_ENDPOINT,
});

export function getImagekitUrlFromPath({
  imagePath,
  transformationArray,
  transformationPostion,
}: {
  imagePath: string;
  transformationArray?: Transformation[];
  transformationPostion?: TransformationPosition;
}) {
  const ikOptions: UrlOptions = {
    urlEndpoint: config.IMAGEKIT_ENDPOINT,
    path: imagePath,
    transformation: transformationArray,
  };

  if (transformationPostion) ikOptions.transformationPosition = transformationPostion;

  const imageURL = imagekit.url(ikOptions);

  return imageURL;
}
