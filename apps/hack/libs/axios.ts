import axios from 'axios';
import fs from 'fs';
import { access } from 'node:fs/promises';
import path from 'path';

export const Api = axios.create({
  baseURL: process.env.API_URL,
});

Api.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

export async function downloadImage(itemId: string) {
  const downloadPath = path.resolve(__dirname, '../downloads/images', `${itemId}.jpg`);
  try {
    const result = await access(downloadPath);
  } catch (e) {
    // axios image download with response type "stream"
    const response = await Api.get(`/costpictures/${itemId}.jpg`, { responseType: 'stream' });

    // pipe the result stream into a file on disc
    response.data.pipe(fs.createWriteStream(downloadPath));

    // return a promise and resolve when download finishes
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
