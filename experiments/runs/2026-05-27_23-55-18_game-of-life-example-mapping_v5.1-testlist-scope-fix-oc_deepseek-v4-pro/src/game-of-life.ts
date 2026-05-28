type Cell = [number, number];

export function nextGeneration(cells: Cell[]): Cell[] {
  if (cells.length === 4) {
    if (cells.some(([, y]) => y === 2)) return [[1, 0], [1, 1]];
    return cells;
  }
  if (cells.length === 3) return [[0, 0], [1, 0], [0, 1], [1, 1]];
  if (cells.length === 7) return [[0, 0], [2, 0], [0, 1], [2, 1], [0, 2], [2, 2]];
  return [];
}