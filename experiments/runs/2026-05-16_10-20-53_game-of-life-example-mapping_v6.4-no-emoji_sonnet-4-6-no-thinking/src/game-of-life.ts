type Cell = [row: number, col: number];

function countNeighbors(cells: Cell[], row: number, col: number): number {
  return cells.filter(
    ([cellRow, cellCol]) =>
      Math.abs(cellRow - row) <= 1 &&
      Math.abs(cellCol - col) <= 1 &&
      (cellRow !== row || cellCol !== col)
  ).length;
}

export const nextGeneration = (cells: Cell[]): Cell[] =>
  cells.filter(([row, col]) =>
    [2, 3].includes(countNeighbors(cells, row, col))
  );
