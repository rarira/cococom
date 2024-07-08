import { getItem } from '../libs/api.js';
import { supabase } from '../libs/supabase.js';
import { loadEnv } from '../libs/util.js';

loadEnv();

(async () => {
  const { data: allItemsWithNoCategory, error } = await supabase.supabaseClient
    .from('items')
    .select('id, itemId')
    .filter('categoryId', 'is', null);

  if (error) {
    console.error('Error fetching items with no category', error);
    return;
  }

  if (!allItemsWithNoCategory.length) {
    console.log('No items with no category found');
    return;
  }

  for (const item of allItemsWithNoCategory) {
    const data = await getItem(item.itemId);
    if (!data) {
      throw new Error(`Item not found: ${item.itemId}`);
    }
    await supabase.updateItem({ categoryId: Number(data.category) }, item.id);
  }
})();
