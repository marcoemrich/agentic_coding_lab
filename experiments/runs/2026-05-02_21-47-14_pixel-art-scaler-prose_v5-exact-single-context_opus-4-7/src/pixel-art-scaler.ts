export const scale = (image: string[][], factor: number): string[][] => {
  return image.flatMap((row) => {
    const expandedRow = row.flatMap((pixel) => Array(factor).fill(pixel));
    return Array(factor).fill(expandedRow);
  });
};
