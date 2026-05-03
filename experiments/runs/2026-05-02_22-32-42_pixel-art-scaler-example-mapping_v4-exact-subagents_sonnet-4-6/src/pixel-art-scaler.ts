const repeat = <T>(item: T, times: number): T[] => Array(times).fill(item);

export const scalePixelArt = (image: string[][], scale: number): string[][] =>
  image.flatMap(row => {
    const scaledRow = row.flatMap(pixel => repeat(pixel, scale));
    return repeat(scaledRow, scale);
  });
