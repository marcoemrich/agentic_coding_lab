const scaleRowHorizontally = (row: number[], scaleFactor: number): number[] =>
  row.flatMap(pixel => Array(scaleFactor).fill(pixel));

export function scalePixelArt(image: number[][], scaleFactor: number): number[][] {
  return image.flatMap(row =>
    Array.from({ length: scaleFactor }, () => scaleRowHorizontally(row, scaleFactor))
  );
}
