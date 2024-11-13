import path from 'path';
import dotenv from 'dotenv';

export function loadEnv() {
  const result = dotenv.config({ path: path.join(__dirname, '..', '.env') });
  if (result.parsed == undefined) throw new Error('Cannot loaded environment variables file.');
}
