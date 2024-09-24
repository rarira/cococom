export type Category = {
  id: number;
  name: string;
};

export type OnlineSubCategoryLink = {
  fullLink: string;
  category: string;
  title: string;
  categoryId?: number;
};

type OnlinePrice = {
  value: number;
} & { [key: string]: string };

type OnlineCouponDiscount = {
  discountStartDate: string;
  discountEndDate: string;
  discountValue: number;
  hideDiscountCalculation: boolean;
} & { [key: string]: string };

type OnlineImage = {
  format:
    | 'thumbnail'
    | 'product'
    | 'results'
    | 'carousel'
    | 'thumbnail-webp'
    | 'product-webp'
    | 'results-webp'
    | 'carousel-webp';
  imageType: string;
  url: string;
};

type ApiResultCategory = {
  campaign: boolean;
  code: string;
  nmae: string;
  subCategories: string[];
  superCategories: string[];
  url: string;
} & { [key: string]: unknown };

type ApiResultPagination = {
  currentPage: number;
  pageSize: number;
  totalPages: number;
  totalResults: number;
  sort: string;
};

export type OnlineProduct = {
  code: string;
  baserice: OnlinePrice;
  couponDiscount: OnlineCouponDiscount;
  images: OnlineImage[];
  isBaseProduct: boolean;
  membership: boolean;
  membershipRestrictionApplied: boolean;
  name: string;
  price: OnlinePrice;
  url: string;
} & { [key: string]: unknown };

export type SearchApiResult = {
  category: ApiResultCategory;
  products: OnlineProduct[];
  pagination: ApiResultPagination;
} & { [key: string]: unknown };
