export const scalePixelArt = (image: string[], scale: number): string[] => {
  if (image.length === 0) return [];
  if (scale === 1) return image;

  const scaledRows: string[] = [];
  for (const row of image) {
    const scaledRow = row.split('').map(char => char.repeat(scale)).join('');
    scaledRows.push(...Array(scale).fill(scaledRow));
  }
  return scaledRows;
};
