/* eslint-disable import/order */
import { supabase } from '../libs/supabase.js';
import {
  clearFolder,
  getMostRecentFile,
  loadEnv,
  readJsonFile,
  writeJsonFile,
  deleteFolderIfEmpty,
} from '../libs/util.js';

loadEnv();

import { access, copyFile, unlink, mkdir } from 'node:fs/promises';
import sharp from 'sharp';

const date = new Date().toISOString().split('T')[0];

type ItemWithItemId = {
  id: number;
  itemId: string;
};

type UniqueItemId = Record<
  string,
  { online: number | null; offline: number | null; finalImageExt?: 'webp' | 'jpg' | null }
>;

async function fetchAllItems() {
  try {
    const data = await supabase.items.fetchAllItemsWithId();
    await writeJsonFile(`data/fetchAllItemsWithId_${date}.json`, data);
  } catch (error) {
    console.log(error);
  }
}

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

  await writeJsonFile(`data/getUniqueItemIds${date}.json`, uniqueItemIds);
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

async function arrangeImageFiles() {
  const uniqueItemIds = (await readJsonFile(
    `data/getUniqueItemIds${date}.json`,
  )) as unknown as UniqueItemId;

  const noImagesCount = 0;

  await clearFolder('downloads/final');

  await searchImageAndCopy({ uniqueItemIds, destinationPath: 'downloads/final/', noImagesCount });

  await writeJsonFile(`data/arrangeImageFiles_${date}.json`, uniqueItemIds);

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
    if (uniqueItemIds[uniqueItemId]?.finalImageExt === 'jpg') {
      // convert to webp
      convertPromises.push(
        (async () => {
          try {
            await sharp(`downloads/final/${uniqueItemId}.jpg`)
              .webp()
              .toFile(`downloads/final/${uniqueItemId}.webp`);

            await unlink(`downloads/final/${uniqueItemId}.jpg`);
            uniqueItemIds[uniqueItemId]!.finalImageExt = 'webp';
          } catch (error) {
            console.error('convertJpgToWebp error', { error, uniqueItemId });
          }
        })(),
      );
    }
  }

  await Promise.allSettled(convertPromises);

  await writeJsonFile(`data/jpgToWebp_${date}.json`, uniqueItemIds);
}

async function updateNewlyAddedImages() {
  const mostRecentJpgToWebpFilePath = await getMostRecentFile('data', 'jpgToWebp');
  console.log({ mostRecentJpgToWebpFilePath });

  if (!mostRecentJpgToWebpFilePath) {
    console.error('No jpgToWebp file found');
    return;
  }

  const uniqueItemIds = (await readJsonFile(
    mostRecentJpgToWebpFilePath,
  )) as unknown as UniqueItemId;

  const currentAllItems = (await readJsonFile(
    `data/fetchAllItemsWithId_${date}.json`,
  )) as unknown as ItemWithItemId[];

  currentAllItems.forEach(item => {
    const itemId = item.itemId.split('_')[0];

    if (!itemId) return;
    if (uniqueItemIds[itemId]) return;

    populateUniqueItemIds(item, uniqueItemIds);
  });

  await searchImageAndCopy({ uniqueItemIds, destinationPath: `downloads/final/${date}/` });

  await deleteFolderIfEmpty(`downloads/final/${date}/`);

  await writeJsonFile(`data/jpgToWebp_${date}.json`, uniqueItemIds);
}

(async () => {
  // await fetchAllItems();
  // await getUniqueItemIds();
  // await verifyUniqueItemIds();
  // await arrangeImageFiles();
  // await jpgToWebp();
  await updateNewlyAddedImages();
})();
