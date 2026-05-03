export const scale = (image: string[][], factor: number): string[][] => {
  return image.flatMap((row) => {
    const scaledRow = row.flatMap((pixel) => Array(factor).fill(pixel));
    return Array(factor).fill(scaledRow);
  });
};
