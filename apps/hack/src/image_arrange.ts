/* eslint-disable import/order */
import { supabase } from '../libs/supabase.js';
import { clearFolder, loadEnv, readJsonFile, writeJsonFile } from '../libs/util.js';

loadEnv();

import { access, copyFile, rm } from 'node:fs/promises';

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

async function getUniqueItemIds() {
  const allItems = (await readJsonFile(
    `data/fetchAllItemsWithId_${date}.json`,
  )) as unknown as ItemWithItemId[];

  const uniqueItemIds: UniqueItemId = {};

  allItems.forEach(item => {
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

async function arrangeImageFiles() {
  const uniqueItemIds = (await readJsonFile(
    `data/getUniqueItemIds${date}.json`,
  )) as unknown as UniqueItemId;

  let noImagesCount = 0;

  await clearFolder('downloads/final');

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
    const promisesObject = getImagePathPromises(uniqueItemId);

    const paths = Object.keys(promisesObject);
    const promises = Object.values(promisesObject);

    try {
      const results = await Promise.allSettled(promises!);
      const firstPathIndex = results.findIndex(result => result.status === 'fulfilled');

      if (firstPathIndex === -1) {
        // console.error('no image found', uniqueItemId);
        uniqueItemIds[uniqueItemId]!.finalImageExt = null;
        noImagesCount++;
        continue;
      }

      const firstPath = paths![firstPathIndex] as keyof ReturnType<typeof getImagePathPromises>;
      const extension = firstPath.split('-').pop();

      await copyFile(
        getRealPath(uniqueItemId, firstPath)!,
        `downloads/final/${uniqueItemId}.${extension}`,
      );
      uniqueItemIds[uniqueItemId]!.finalImageExt = extension as 'webp' | 'jpg';
    } catch (error) {
      console.error(error);
    }
  }

  await writeJsonFile(`data/arrangeImageFiles_${date}.json`, uniqueItemIds);

  console.log('arrangeImageFiles  done', {
    totalItemIds: Object.keys(uniqueItemIds).length,
    noImagesCount,
  });
}

(async () => {
  await fetchAllItems();
  await getUniqueItemIds();
  await verifyUniqueItemIds();
  await arrangeImageFiles();
})();
