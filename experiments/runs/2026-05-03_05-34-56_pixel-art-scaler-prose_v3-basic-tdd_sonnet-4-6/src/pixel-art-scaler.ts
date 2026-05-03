export function scalePixelArt(image: string[][], scale: number): string[][] {
  if (image.length === 0) return [];
  return image.flatMap(row =>
    Array.from({ length: scale }, () => row.flatMap(pixel => Array(scale).fill(pixel)))
  );
}
