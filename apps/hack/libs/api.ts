import { Api } from './axios';

export type PostSearchApiResult = {
  productcode: string;
  productname: string;
};

export type GetCountApiResult = {
  startdate: string;
  enddate: string;
  price: number;
  discount: number;
  discountprice: number;
};

export type GetItemForModifyResult = {
  category: string;
} & PostSearchApiResult;

export type GetAllDatasResult = GetItemForModifyResult &
  GetCountApiResult &
  Record<string, unknown>;

export async function getSearchResults(keyword: string, itemSet: Set<string>) {
  const { data } = await Api.post('/postsearch.php', {
    searchstring: keyword,
  });

  const { search } = JSON.parse(data.replace('search', '"search"')) as {
    search: PostSearchApiResult[];
  };

  search.forEach(item => {
    itemSet.add(item.productcode);
  });

  return search;
}

export async function getSearchResults2(itemId: string, currentDate: string) {
  const { data } = await Api.post('/getsearchresult2.php', {
    currentdate: currentDate,
    productcode: itemId,
  });

  return data.count as GetCountApiResult[];
}

export async function getItem(itemId: string) {
  const { data } = await Api.post('/getitemformodify.php', {
    productcode: itemId,
  });

  const { modify } = JSON.parse(data.replace('modify', '"modify"')) as {
    modify: GetItemForModifyResult[];
  };

  return modify[0];
}

export async function getAllDatas(currentDate: string) {
  const { data } = await Api.post('/AllNewData/getAllDatas.php', {
    currentdate: currentDate,
  });

  const { discounts } = JSON.parse(data.replace('discounts', '"discounts"')) as {
    discounts: GetAllDatasResult[];
  };

  return discounts;
}
