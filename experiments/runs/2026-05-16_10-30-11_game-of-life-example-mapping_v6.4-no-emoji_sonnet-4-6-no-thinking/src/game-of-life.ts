type Cell = [row: number, col: number];

function isNeighbor(cellRow: number, cellCol: number, row: number, col: number): boolean {
  return Math.abs(cellRow - row) <= 1 && Math.abs(cellCol - col) <= 1 && !(cellRow === row && cellCol === col);
}

function countNeighbors(cells: Cell[], row: number, col: number): number {
  return cells.filter(([cellRow, cellCol]) => isNeighbor(cellRow, cellCol, row, col)).length;
}

function survives(neighborCount: number): boolean {
  return neighborCount === 2 || neighborCount === 3;
}

export function nextGeneration(cells: Cell[]): Cell[] {
  return cells.filter(([row, col]) => survives(countNeighbors(cells, row, col)));
}
