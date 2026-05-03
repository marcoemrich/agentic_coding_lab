export const scale = (image: string[][], factor: number): string[][] => {
  return image.flatMap((row) =>
    Array(factor).fill(row.flatMap((pixel) => Array(factor).fill(pixel))),
  );
};
