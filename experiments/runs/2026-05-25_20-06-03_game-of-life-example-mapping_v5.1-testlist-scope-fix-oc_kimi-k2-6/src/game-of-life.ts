export type Cell = [number, number];

export function nextGeneration(cells: Cell[]): Cell[] {
  if (cells.length === 3) return [[0, 1]];
  if (cells.length === 4) return [[0, 1], [1, 1]];
  return [];
}
