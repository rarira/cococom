const Util = {
  toWonString(value: number): string {
    return value.toLocaleString('ko-KR');
  },
  toPercentString(value: number): string {
    return Math.floor(value * 100).toString();
  },
};

export default Util;
