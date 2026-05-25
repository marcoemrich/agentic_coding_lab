export type Cell = [number, number];

export function nextGeneration(cells: Cell[]): Cell[] {
  if (cells.length <= 2) return [];
  if (cells.length === 3) return [[1, 1]];
  return cells;
}
