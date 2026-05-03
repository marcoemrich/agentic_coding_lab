export const scale = (image: string[], factor: number): string[] => {
  return image.flatMap((row) => {
    const scaledRow = row.replace(/./g, (pixel) => pixel.repeat(factor));
    return Array(factor).fill(scaledRow);
  });
};
