export function scalePixelArt(image: string[], scale: number): string[] {
  if (image.length === 0) return [];
  const scaledRows = image.map(row =>
    row.split('').map(pixel => pixel.repeat(scale)).join('')
  );
  const result: string[] = [];
  for (const row of scaledRows) {
    for (let i = 0; i < scale; i++) {
      result.push(row);
    }
  }
  return result;
}
