/* eslint-disable import/order */
import { supabase } from '../libs/supabase.js';
import { loadEnv, writeJsonFile } from '../libs/util.js';

loadEnv();

import { retryFailedUploading, updateNewlyAddedImages, uploadImages } from '../libs/images.js';

const date = new Date().toISOString().split('T')[0];

async function fetchAllItems() {
  console.log('image_arrange fetchAllItems');
  try {
    const data = await supabase.items.fetchAllItemsWithId();
    writeJsonFile(`data/fetchAllItemsWithId_${date}.json`, data);
  } catch (error) {
    console.log(error);
  }
}

(async () => {
  // 초기 데이터 가져오기
  // await getUniqueItemIds();
  // await verifyUniqueItemIds();
  // await arrangeImageFiles();
  // await jpgToWebp();
  // await buildDownloadedImagesIndex();

  //루틴 실행
  await fetchAllItems();
  await updateNewlyAddedImages();
  await uploadImages(`downloads/final/${date}`);

  // 실패 파일 재시도
  await retryFailedUploading();

  // 미디어라이브러리 지우기
  // await deleteAllFilesInFolder('/');
})();
