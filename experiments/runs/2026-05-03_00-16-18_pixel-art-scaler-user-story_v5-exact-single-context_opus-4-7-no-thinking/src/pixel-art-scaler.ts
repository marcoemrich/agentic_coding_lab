const repeat = <T>(value: T, times: number): T[] => Array(times).fill(value);

export const scalePixelArt = (image: string[][], scale: number): string[][] =>
  image.flatMap(row => repeat(row.flatMap(pixel => repeat(pixel, scale)), scale));
