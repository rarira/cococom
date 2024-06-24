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
  const result = dotenv.config({ path: path.join(__dirname, '..', '.env') }); // .env 파일의 경로를 dotenv.config에 넘겨주고 성공여부를 저장함
  if (result.parsed == undefined)
    // .env 파일 parsing 성공 여부 확인
    throw new Error('Cannot loaded environment variables file.'); // parsing 실패 시 Throwing
}
