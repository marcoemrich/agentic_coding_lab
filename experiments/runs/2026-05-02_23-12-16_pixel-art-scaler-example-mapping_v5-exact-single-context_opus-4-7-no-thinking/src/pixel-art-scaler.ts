export const scalePixelArt = (image: string[], scale: number): string[] => {
  return image.flatMap((row) => {
    const scaledRow = [...row].map((c) => c.repeat(scale)).join("");
    return Array(scale).fill(scaledRow);
  });
};
