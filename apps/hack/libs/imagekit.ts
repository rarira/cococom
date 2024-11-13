/* eslint-disable turbo/no-undeclared-env-vars */
import { readFile } from 'node:fs/promises';

import ImageKit from 'imagekit';

import { loadEnv } from './util.js';

loadEnv();

const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY!,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY!,
  urlEndpoint: process.env.IMAGEKIT_ENDPOINT!,
});

export async function uploadImageToImageKit({
  targetFolder,
  filePath,
  fileName,
}: {
  targetFolder: string;
  filePath: string;
  fileName: string;
}) {
  const file = await readFile(filePath);

  await imagekit.upload({
    file,
    fileName: fileName,
    folder: targetFolder,
    overwriteFile: false,
    useUniqueFileName: false,
  });
}

export async function deleteAllFilesInFolder(folderPath: string) {
  try {
    // 폴더 내 파일 목록 가져오기
    const files = await imagekit.listFiles({
      path: folderPath,
      limit: 1000, // 최대 파일 수 (1000개까지 지원)
      includeFolder: false,
    });

    if (files.length === 0) {
      console.log(`No files found in the folder: ${folderPath}`);
      return;
    }

    // 파일 삭제 요청을 병렬로 수행

    for (const file of files) {
      await imagekit.deleteFile(file.fileId);
      console.log(`Deleted file: ${file.name}`);
    }

    console.log(`All files in folder '${folderPath}' have been deleted.`);
  } catch (err) {
    console.error('Error fetching or deleting files:', err);
  }
}
