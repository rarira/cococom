export type NullableNumber = null | number;

export type ObjectValues<T> = T[keyof T];

export type IntroPageProps = {
  pageNo: number;
  activePageNo: number;
};
