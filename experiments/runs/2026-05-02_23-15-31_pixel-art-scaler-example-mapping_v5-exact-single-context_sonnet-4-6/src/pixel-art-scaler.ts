const scaleRow = (row: string, scale: number): string =>
  row.split("").map(pixel => pixel.repeat(scale)).join("");

export const scalePixelArt = (image: string[], scale: number): string[] =>
  image.flatMap(row => Array.from({ length: scale }, () => scaleRow(row, scale)));
