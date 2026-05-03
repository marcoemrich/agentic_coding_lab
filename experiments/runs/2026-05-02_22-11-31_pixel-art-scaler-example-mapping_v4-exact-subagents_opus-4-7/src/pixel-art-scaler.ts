const scaleRow = (row: string, factor: number): string =>
  [...row].map((pixel) => pixel.repeat(factor)).join("");

export const scale = (image: string[], factor: number): string[] =>
  image.flatMap((row) => Array(factor).fill(scaleRow(row, factor)));
