import { PrismaClient } from '@prisma/client';
import { GetCountApiResult, GetItemForModifyResult, PostSearchApiResult } from './api';
import { addDays, getDateWithTimezone, getISOTimeStringWithTimezone } from './date';

export const prisma = new PrismaClient();

export async function getAllItems() {
  return await prisma.item.findMany();
}

export async function getAllCategories() {
  return await prisma.category.findMany();
}

export async function getAllDiscounts() {
  return await prisma.discount.findMany();
}

export async function upsertItem(itemData: PostSearchApiResult) {
  try {
    await prisma.item.upsert({
      where: {
        itemId: itemData.productcode,
      },
      update: {
        itemName: itemData.productname,
      },
      create: {
        itemId: itemData.productcode,
        itemName: itemData.productname,
      },
    });
  } catch (e) {
    console.error(e, itemData);
  }
}

export async function updateItemWithCategory(itemData: GetItemForModifyResult) {
  try {
    await prisma.item.update({
      where: {
        itemId: itemData.productcode,
      },
      data: {
        categoryId: Number(itemData.category),
      },
    });
  } catch (e) {
    console.error(e, itemData);
  }
}

export async function createDiscount(
  itemId: string,
  { startdate, enddate, price, discount, discountprice }: GetCountApiResult,
) {
  try {
    await prisma.discount.create({
      data: {
        startDate: getISOTimeStringWithTimezone(startdate),
        endDate: addDays(getDateWithTimezone(enddate), 1),
        price: price,
        discount: discount,
        discountPrice: discountprice,
        discountHash: `${itemId}_${startdate}_${enddate}`,
        item: {
          connect: {
            itemId,
          },
        },
      },
    });
  } catch (e) {
    if (e.code === 'P2002') return; // Unique constraint error (already exists)
    console.error(e, { itemId, startdate });
  }
}

export async function createCategory({ id, name }: { id: number; name: string }) {
  try {
    await prisma.category.create({
      data: {
        id,
        categoryName: name,
      },
    });
  } catch (e) {
    if (e.code === 'P2002') return; // Unique constraint error (already exists)
    console.error(e, { id, name });
  }
}
