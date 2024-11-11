import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { readdir, stat, rm, unlink } from 'node:fs/promises';

import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url); // get the resolved path to the file
const __dirname = path.dirname(__filename); // get the name of the directory

export function writeJsonFile(filePath: string, data: unknown) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

export function readJsonFile(filePath: string) {
  return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
}

export function loadEnv() {
  const result = dotenv.config({ path: path.join(__dirname, '..', '.env') });
  if (result.parsed == undefined) throw new Error('Cannot loaded environment variables file.');
}

export function checkIfOnlyAlphabetUpperCase(str: string) {
  return /^[A-Z\s]+$/.test(str);
}

export async function clearFolder(folderPath: string) {
  try {
    const files = await readdir(folderPath);
    await Promise.all(
      files.map(async file => {
        const filePath = path.join(folderPath, file);
        const stats = await stat(filePath);

        if (stats.isDirectory()) {
          await rm(filePath, { recursive: true, force: true });
        } else {
          await unlink(filePath);
        }
      }),
    );
    console.log('Folder contents cleared successfully.');
  } catch (error) {
    console.error('Error clearing folder:', error);
  }
}
