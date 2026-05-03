const repeat = <T>(value: T, times: number): T[] => Array(times).fill(value);

export const scalePixelArt = (grid: string[][], scale: number): string[][] =>
  grid.flatMap((row) => repeat(row.flatMap((cell) => repeat(cell, scale)), scale));
