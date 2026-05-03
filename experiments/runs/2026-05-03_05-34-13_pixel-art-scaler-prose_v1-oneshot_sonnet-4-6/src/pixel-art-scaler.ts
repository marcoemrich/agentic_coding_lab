export function scalePixelArt(image: string[][], scale: number): string[][] {
  if (image.length === 0) return [];
  return image.flatMap(row => {
    const scaledRow = row.flatMap(pixel => Array(scale).fill(pixel));
    return Array(scale).fill(scaledRow);
  });
}
