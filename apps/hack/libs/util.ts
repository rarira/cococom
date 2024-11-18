import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { readdir, stat, rm, unlink, rmdir } from 'node:fs/promises';

import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url); // get the resolved path to the file
const __dirname = path.dirname(__filename); // get the name of the directory

export function writeJsonFile(filePath: string, data: unknown) {
  // const finalPathString = filePath.split('_').pop();
  // const isFinalPathStringDate = finalPathString
  //   ? finalPathString.match(/^\d{4}-\d{2}-\d{2}/)
  //   : false;

  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));

  // isFinalPathStringDate가 true일 때는 현재 filePath의 파일을 제외하고는 다른 파일을 모두 삭제
  // if (isFinalPathStringDate) {
  //   const files = fs.readdirSync(path.dirname(filePath));
  //   const fileNameExceptFinalPathString = filePath.replace(finalPathString!, '');

  //   files.forEach(file => {
  //     if (file.startsWith(fileNameExceptFinalPathString) && file !== path.basename(filePath)) {
  //       fs.unlinkSync(path.join(path.dirname(filePath), file));
  //     }
  //   });
  // }
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

export async function getMostRecentFile(folderPath: string, prefix: string) {
  try {
    // 파일 이름 패턴 설정 (예: jpgToWebp_YYYY-MM-DD.json)
    const datePattern = new RegExp(`^${prefix}_(\\d{4}-\\d{2}-\\d{2})\\.json$`);

    // 폴더 내 파일 목록을 읽어옵니다
    const files = await readdir(folderPath);

    // 형식이 맞는 파일들만 필터링
    const datedFiles = files
      .map(file => {
        const match = file.match(datePattern);
        if (match) {
          return { file, date: match[1] ? new Date(match[1]) : new Date(0) };
        }
        return null;
      })
      .filter(Boolean); // 유효한 파일만 남기기

    if (datedFiles.length === 0) {
      console.log('No matching files found.');
      return null;
    }

    // 최신 날짜의 파일 찾기
    const mostRecentFile = datedFiles.reduce((latest, current) =>
      current && latest && latest.date > current.date ? latest : current,
    );

    // 가장 최신 파일 경로
    const mostRecentFilePath = path.join(folderPath, mostRecentFile!.file);

    console.log(`Most recent file: ${mostRecentFile!.file}`);
    return mostRecentFilePath;
  } catch (err) {
    console.error('Error reading folder:', err);
  }
}

export async function deleteFolderIfEmpty(folderPath: string) {
  try {
    // 폴더 내 파일 목록을 읽어옵니다
    const files = await readdir(folderPath);

    // 파일이 없는 경우 폴더 삭제
    if (files.length === 0) {
      await rmdir(folderPath); // 폴더가 비어 있을 때만 삭제 가능
      console.log(`Folder '${folderPath}' is empty and has been deleted.`);
    } else {
      console.log(
        `Folder '${folderPath}' contains ${files.length} file(s) and will not be deleted.`,
      );
    }
  } catch (err) {
    console.error('Error checking folder:', err);
  }
}
