const repeat = <T>(value: T, times: number): T[] => Array(times).fill(value);

export function scalePixelArt(image: string[][], scaleFactor: number): string[][] {
  if (scaleFactor === 1) return image;
  return image.flatMap(row =>
    repeat(row.flatMap(pixel => repeat(pixel, scaleFactor)), scaleFactor)
  );
}
