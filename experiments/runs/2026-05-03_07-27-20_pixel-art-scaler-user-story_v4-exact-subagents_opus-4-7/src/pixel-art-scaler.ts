export function scalePixelArt(image: string[], scale: number): string[] {
  const scaledRow = (row: string) => [...row].map((ch) => ch.repeat(scale)).join("");
  return image.flatMap((row) => Array(scale).fill(scaledRow(row)));
}
