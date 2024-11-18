import { access, copyFile, unlink, mkdir, readdir } from 'node:fs/promises';

import { uploadImageToImageKit } from '@cococom/imagekit/server';
import sharp from 'sharp';

import { getMostRecentFile, readJsonFile, deleteFolderIfEmpty, writeJsonFile } from './util.js';

export type ItemWithItemId = {
  id: number;
  itemId: string;
};

export type UniqueItemId = Record<
  string,
  { online: number | null; offline: number | null; finalImageExt?: 'webp' | 'jpg' | null }
>;

export type DownloadedImagesIndex = Record<
  string,
  { in: string | null; out: string | null; offline: string | null }
>;

type UploadImages = {
  folderPath: string;
  totalFiles: number;
  uploadFailed: string[];
};

const date = new Date().toISOString().split('T')[0];

function populateUniqueItemIds(item: ItemWithItemId, uniqueItemIds: UniqueItemId) {
  const [itemId, isOnline] = item.itemId.split('_');

  if (!itemId) return;

  if (!uniqueItemIds[itemId]) {
    uniqueItemIds[itemId] = { online: null, offline: null };
  }

  if (isOnline === 'online') {
    if (uniqueItemIds[itemId].online !== null) {
      console.error('already populated online itemId', item.id, item.itemId);
    }
    uniqueItemIds[itemId].online = item.id;
  } else {
    if (uniqueItemIds[itemId].offline !== null) {
      console.error('already populated offline itemId', item.id, item.itemId);
    }
    uniqueItemIds[itemId].offline = item.id;
  }
}

async function getUniqueItemIds() {
  const allItems = (await readJsonFile(
    `data/fetchAllItemsWithId_${date}.json`,
  )) as unknown as ItemWithItemId[];

  const uniqueItemIds: UniqueItemId = {};

  allItems.forEach(item => {
    populateUniqueItemIds(item, uniqueItemIds);
  });

  writeJsonFile(`data/getUniqueItemIds${date}.json`, uniqueItemIds);
}

async function verifyUniqueItemIds() {
  const uniqueItemIds = (await readJsonFile(
    `data/getUniqueItemIds${date}.json`,
  )) as unknown as UniqueItemId;

  const count = {
    total: 0,
    onlineOnly: 0,
    offlineOnly: 0,
    both: 0,
  };

  for (const uniqueItemId in uniqueItemIds) {
    count.total++;
    if (
      uniqueItemIds[uniqueItemId]?.online !== null &&
      uniqueItemIds[uniqueItemId]?.offline === null
    ) {
      count.onlineOnly++;
    } else if (
      uniqueItemIds[uniqueItemId]?.offline !== null &&
      uniqueItemIds[uniqueItemId]?.online === null
    ) {
      count.offlineOnly++;
    } else {
      count.both++;
    }
  }

  console.log('verifyUniqueItemIds', { count });
}

async function arrangeImageFiles() {
  const uniqueItemIds = (await readJsonFile(
    `data/getUniqueItemIds${date}.json`,
  )) as unknown as UniqueItemId;

  const noImagesCount = 0;

  await clearFolder('downloads/final');

  await searchImageAndCopy({ uniqueItemIds, destinationPath: 'downloads/final/', noImagesCount });

  writeJsonFile(`data/arrangeImageFiles_${date}.json`, uniqueItemIds);

  console.log('arrangeImageFiles  done', {
    totalItemIds: Object.keys(uniqueItemIds).length,
    noImagesCount,
  });
}

async function jpgToWebp() {
  const uniqueItemIds = (await readJsonFile(
    `data/arrangeImageFiles_${date}.json`,
  )) as unknown as UniqueItemId;

  const convertPromises: Promise<void>[] = [];

  for (const uniqueItemId in uniqueItemIds) {
    const convertPromise = new Promise<void>((resolve, reject) => {
      console.log('converting', uniqueItemId);
      sharp(`downloads/final/${uniqueItemId}.jpg`)
        .webp()
        .toFile(`downloads/final/${uniqueItemId}.webp`)
        .then(() => {
          unlink(`downloads/final/${uniqueItemId}.jpg`);
        })
        .then(() => {
          uniqueItemIds[uniqueItemId]!.finalImageExt = 'webp';
          resolve();
        })
        .catch(error => {
          console.error('convertJpgToWebp error', { error, uniqueItemId });
          reject();
        });
    });

    convertPromises.push(convertPromise);
  }

  await Promise.allSettled(convertPromises);

  writeJsonFile(`data/jpgToWebp_${date}.json`, uniqueItemIds);
}

async function searchImageAndCopy({
  uniqueItemIds,
  destinationPath,
  noImagesCount,
}: {
  uniqueItemIds: UniqueItemId;
  destinationPath: string;
  noImagesCount?: number;
}) {
  try {
    await access(destinationPath);
  } catch {
    await mkdir(destinationPath, { recursive: true });
  }

  function getImagePathPromises(itemId: string) {
    const promises: Record<string, Promise<void>> = {};

    promises['online-in-webp'] = access(`downloads/online-images/in/${itemId}.webp`);
    promises['online-in-jpg'] = access(`downloads/online-images/in/${itemId}.jpg`);
    promises['online-out-webp'] = access(`downloads/online-images/out/${itemId}.webp`);
    promises['online-out-jpg'] = access(`downloads/online-images/out/${itemId}.jpg`);
    promises['offline-webp'] = access(`downloads/images/${itemId}.webp`);
    promises['offline-jpg'] = access(`downloads/images/${itemId}.jpg`);

    return promises;
  }

  function getRealPath(itemId: string, pathProp: keyof ReturnType<typeof getImagePathPromises>) {
    switch (pathProp) {
      case 'online-in-webp':
        return `downloads/online-images/in/${itemId}.webp`;
      case 'online-in-jpg':
        return `downloads/online-images/in/${itemId}.jpg`;
      case 'online-out-webp':
        return `downloads/online-images/out/${itemId}.webp`;
      case 'online-out-jpg':
        return `downloads/online-images/out/${itemId}.jpg`;
      case 'offline-webp':
        return `downloads/images/${itemId}.webp`;
      case 'offline-jpg':
        return `downloads/images/${itemId}.jpg`;
    }
  }

  for (const uniqueItemId in uniqueItemIds) {
    if (uniqueItemIds[uniqueItemId]?.finalImageExt) continue;

    const promisesObject = getImagePathPromises(uniqueItemId);

    const paths = Object.keys(promisesObject);
    const promises = Object.values(promisesObject);

    try {
      const results = await Promise.allSettled(promises!);
      const firstPathIndex = results.findIndex(result => result.status === 'fulfilled');

      if (firstPathIndex === -1) {
        // console.error('no image found', uniqueItemId);
        uniqueItemIds[uniqueItemId]!.finalImageExt = null;
        typeof noImagesCount !== 'undefined' && noImagesCount++;
        continue;
      }

      const firstPath = paths![firstPathIndex] as keyof ReturnType<typeof getImagePathPromises>;
      const extension = firstPath.split('-').pop();

      await copyFile(
        getRealPath(uniqueItemId, firstPath)!,
        `${destinationPath}${uniqueItemId}.${extension}`,
      );
      uniqueItemIds[uniqueItemId]!.finalImageExt = extension as 'webp' | 'jpg';
    } catch (error) {
      console.error(error);
    }
  }
}

export async function updateNewlyAddedImages(items?: ItemWithItemId[]) {
  console.log('call updateNewlyAddedImages', items?.length);
  const uniqueItemIds = await getMostRecentUniqueItemIds();
  if (items?.length) {
    items.forEach(item => {
      populateUniqueItemIds(item, uniqueItemIds);
    });
  } else {
    const currentAllItems = (await readJsonFile(
      `data/fetchAllItemsWithId_${date}.json`,
    )) as unknown as ItemWithItemId[];

    currentAllItems.forEach(item => {
      const itemId = item.itemId.split('_')[0];

      if (!itemId) return;
      if (uniqueItemIds[itemId]) return;

      populateUniqueItemIds(item, uniqueItemIds);
    });
  }

  await searchImageAndCopy({ uniqueItemIds, destinationPath: `downloads/final/${date}/` });

  await deleteFolderIfEmpty(`downloads/final/${date}/`);

  writeJsonFile(`data/jpgToWebp_${date}.json`, uniqueItemIds);
}

export async function uploadImages(folderPath: string) {
  const files = await readdir(folderPath, { withFileTypes: true, recursive: false });

  const uploadFailed: string[] = [];

  let count = 0;

  for (const file of files) {
    if (file.isFile() && file.name.endsWith('.webp')) {
      try {
        await uploadImageToImageKit({
          targetFolder: 'products',
          filePath: `${folderPath}/${file.name}`,
          fileName: file.name,
        });
        count++;
        console.log(count, ': uploaded', file.name);
      } catch (error) {
        if (
          (error as Error).message ===
          'A file with the same name already exists at the exact location. We could not overwrite it because both overwriteFile and useUniqueFileName are set to false.'
        ) {
          console.log(count, ': skip existing', file.name);
          count++;
          continue;
        }
        console.error(count, 'upload error', { error, file: file.name });
        uploadFailed.push(file.name);
        count++;
      }
    }
  }

  writeJsonFile(`data/uploadImages_${date}.json`, {
    folderPath,
    totalFiles: files.length,
    uploadFailed,
  });

  console.log('upload done', { totalFiles: files.length, uploadFailed: uploadFailed.length });
}

export async function retryFailedUploading() {
  const mostRecentUploadImagesFilePath = await getMostRecentFile('data', 'uploadImages');
  console.log({ mostRecentUploadImagesFilePath });

  if (!mostRecentUploadImagesFilePath) {
    console.error('No jpgToWebp file found');
    return;
  }

  const { folderPath, uploadFailed } = (await readJsonFile(
    mostRecentUploadImagesFilePath,
  )) as unknown as UploadImages;

  if (uploadFailed.length === 0) {
    console.log('No failed uploads');
    return;
  }

  let count = 0;

  const retryUploadFailed: string[] = [...uploadFailed];
  uploadFailed.length = 0;

  for (const file of retryUploadFailed) {
    try {
      await uploadImageToImageKit({
        targetFolder: 'products',
        filePath: `${folderPath}/${file}`,
        fileName: file,
      });
    } catch (error) {
      if (
        (error as Error).message ===
        'A file with the same name already exists at the exact location. We could not overwrite it because both overwriteFile and useUniqueFileName are set to false.'
      ) {
        console.log(count, ': skip existing', file);
        count++;
        continue;
      }
      console.error(count, 'upload error', { error, file });
      uploadFailed.push(file);
    }
  }

  writeJsonFile(`data/uploadImages_${date}.json`, {
    folderPath,
    totalFiles: count,
    uploadFailed,
  });
}

export async function buildDownloadedImagesIndex() {
  const onlineOutFiles = await readdir('downloads/online-images/out', { withFileTypes: true });
  const onlineInFiles = await readdir('downloads/online-images/in', { withFileTypes: true });
  const offlineFiles = await readdir('downloads/images', { withFileTypes: true });

  const index: DownloadedImagesIndex = {};

  for (const file of onlineOutFiles) {
    if (file.isFile()) {
      if (!index[file.name.split('.')[0]!]) {
        index[file.name.split('.')[0]!] = { in: null, out: null, offline: null };
      }
      index[file.name.split('.')[0]!]!.out = file.name;
    }
  }

  for (const file of onlineInFiles) {
    if (file.isFile()) {
      if (!index[file.name.split('.')[0]!]) {
        index[file.name.split('.')[0]!] = { in: null, out: null, offline: null };
      }
      index[file.name.split('.')[0]!]!.in = file.name;
    }
  }

  for (const file of offlineFiles) {
    if (file.isFile()) {
      if (!index[file.name.split('.')[0]!]) {
        index[file.name.split('.')[0]!] = { in: null, out: null, offline: null };
      }
      index[file.name.split('.')[0]!]!.offline = file.name;
    }
  }

  writeJsonFile(`data/downloadedImagesIndex_${date}.json`, index);
}

export async function getMostRecentDownloadedImagesIndex() {
  const mostRecentDownloadedImagesIndexFilePath = await getMostRecentFile(
    'data',
    'downloadedImagesIndex',
  );

  if (!mostRecentDownloadedImagesIndexFilePath) {
    throw new Error('No downloadedImagesIndex file found');
  }

  const downloadedImagesIndex = (await readJsonFile(
    mostRecentDownloadedImagesIndexFilePath,
  )) as unknown as DownloadedImagesIndex;

  return downloadedImagesIndex;
}

export async function getMostRecentUniqueItemIds() {
  const mostRecentJpgToWebpFilePath = await getMostRecentFile('data', 'jpgToWebp');

  if (!mostRecentJpgToWebpFilePath) {
    throw new Error('No jpgToWebp file found');
  }

  const uniqueItemIds = (await readJsonFile(
    mostRecentJpgToWebpFilePath,
  )) as unknown as UniqueItemId;

  return uniqueItemIds;
}
