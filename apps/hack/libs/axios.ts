// eslint-disable-next-line import/order
import { loadEnv } from '../libs/util.js';

loadEnv();

import fs from 'fs';
import { access } from 'node:fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

import axios from 'axios';

const __filename = fileURLToPath(import.meta.url); // get the resolved path to the file
const __dirname = path.dirname(__filename); // get the name of the directory

export const Api = axios.create({
  baseURL: process.env.API_URL!,
});

Api.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

export async function download({
  url,
  localPath,
  fileName,
}: {
  url: string;
  localPath: string;
  fileName: string;
}) {
  const downloadPath = path.resolve(__dirname, localPath, fileName);

  try {
    await access(downloadPath);
  } catch (e) {
    const response = await axios.get(url, { responseType: 'stream' });

    response.data.pipe(fs.createWriteStream(downloadPath));

    return new Promise<void>((resolve, reject) => {
      response.data.on('end', () => {
        resolve();
      });

      response.data.on('error', () => {
        reject();
      });
    });
  }
}

export async function downloadImage(itemId: string) {
  await download({
    // eslint-disable-next-line turbo/no-undeclared-env-vars
    url: `${process.env.S3_URL}${itemId}.webp`,
    localPath: '../downloads/images',
    fileName: `${itemId}.webp`,
  });
}
