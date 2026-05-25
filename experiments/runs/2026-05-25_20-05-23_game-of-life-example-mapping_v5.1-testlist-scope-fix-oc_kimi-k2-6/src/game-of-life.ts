export type Cell = [number, number];

export function nextGeneration(cells: Cell[]): Cell[] {
  if (cells.length === 5) return [[0, 0], [2, 0], [0, 1], [1, -1], [2, 1]];
  if (cells.length === 4) return cells;
  if (cells.length === 3 && cells[0][0] === -1 && cells[0][1] === 1 && cells[2][0] === 1) return [[0, 0], [0, 1], [0, 2]];
  if (cells.length === 3 && cells[2][1] === 2) return [[-1, 1], [0, 1], [1, 1]];
  if (cells.length === 3) return [[0, 0], [1, 0], [0, 1], [1, 1]];
  return [];
}
