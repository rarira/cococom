import fs from 'fs';
import dotenv from 'dotenv';
import path from 'path';

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
