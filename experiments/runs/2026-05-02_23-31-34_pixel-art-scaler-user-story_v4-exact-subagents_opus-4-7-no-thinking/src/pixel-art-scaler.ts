const repeat = <T>(value: T, times: number): T[] => Array(times).fill(value);

const scaleRowHorizontally = (row: string[], scale: number): string[] =>
  row.flatMap((pixel) => repeat(pixel, scale));

export const scalePixelArt = (image: string[][], scale: number): string[][] =>
  image.flatMap((row) => repeat(scaleRowHorizontally(row, scale), scale));
