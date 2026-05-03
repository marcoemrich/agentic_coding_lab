export const scalePixelArt = (image: string[], scale: number): string[] => {
  return image.flatMap(row =>
    Array(scale).fill(row.split("").map(pixel => pixel.repeat(scale)).join(""))
  );
};
