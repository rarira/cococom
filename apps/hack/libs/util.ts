import fs from 'fs';
import dotenv from 'dotenv';
import path from 'path';

import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url); // get the resolved path to the file
const __dirname = path.dirname(__filename); // get the name of the directory

export function writeJsonFile(filePath, data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

export function readJsonFile(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
}

export function loadEnv() {
  const result = dotenv.config({ path: path.join(__dirname, '..', '.env') });
  if (result.parsed == undefined) throw new Error('Cannot loaded environment variables file.');
}
