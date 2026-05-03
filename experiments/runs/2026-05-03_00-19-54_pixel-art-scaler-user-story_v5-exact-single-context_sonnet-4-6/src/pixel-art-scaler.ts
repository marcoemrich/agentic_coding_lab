export const scalePixelArt = (image: string[][], scale: number): string[][] => {
  return image.flatMap(row => {
    const scaledRow = row.flatMap(pixel => Array(scale).fill(pixel));
    return Array(scale).fill(scaledRow);
  });
};
