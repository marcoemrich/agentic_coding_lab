export function scalePixelArt(image: string[][], scale: number): string[][] {
  if (image.length === 0) return [];
  const result: string[][] = [];
  for (const row of image) {
    const scaledRow = row.flatMap(pixel => Array(scale).fill(pixel));
    for (let i = 0; i < scale; i++) {
      result.push([...scaledRow]);
    }
  }
  return result;
}
