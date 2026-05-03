const repeat = <T>(item: T, times: number): T[] => Array(times).fill(item);

export const scalePixelArt = (image: string[][], scale: number): string[][] => {
  return image.flatMap((row) => {
    const widenedRow = row.flatMap((pixel) => repeat(pixel, scale));
    return repeat(widenedRow, scale);
  });
};
