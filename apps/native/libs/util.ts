const Util = {
  toWonString(value: number): string {
    return value.toLocaleString('ko-KR');
  },
  toPercentString(value: number): string {
    return Math.floor(value * 100).toString();
  },
  hexToRgba(hex: string, alpha = 1): string {
    // Remove the leading '#' if it exists
    hex = hex.replace(/^#/, '');

    // Parse the color values
    let r, g, b, a;

    if (hex.length === 3) {
      // Handle shorthand hex code #RGB
      r = parseInt(hex[0] + hex[0], 16);
      g = parseInt(hex[1] + hex[1], 16);
      b = parseInt(hex[2] + hex[2], 16);
      a = alpha;
    } else if (hex.length === 6) {
      // Handle hex code #RRGGBB
      r = parseInt(hex.slice(0, 2), 16);
      g = parseInt(hex.slice(2, 4), 16);
      b = parseInt(hex.slice(4, 6), 16);
      a = alpha;
    } else if (hex.length === 8) {
      // Handle hex code #RRGGBBAA
      r = parseInt(hex.slice(0, 2), 16);
      g = parseInt(hex.slice(2, 4), 16);
      b = parseInt(hex.slice(4, 6), 16);
      a = parseInt(hex.slice(6, 8), 16) / 255;
    } else {
      throw new Error('Invalid hex color code');
    }

    return `rgba(${r}, ${g}, ${b}, ${a})`;
  },
  showMaxNumber(value: number, max: number): string {
    return value > max ? `${max}+` : value.toString();
  },
};

export default Util;
