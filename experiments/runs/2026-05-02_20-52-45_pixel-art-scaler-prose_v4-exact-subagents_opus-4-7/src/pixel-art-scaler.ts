const scaleRowHorizontally = (row: string, scale: number): string =>
  [...row].map((pixel) => pixel.repeat(scale)).join("");

export const scalePixelArt = (image: string[], scale: number): string[] =>
  image.flatMap((row) => Array(scale).fill(scaleRowHorizontally(row, scale)));
