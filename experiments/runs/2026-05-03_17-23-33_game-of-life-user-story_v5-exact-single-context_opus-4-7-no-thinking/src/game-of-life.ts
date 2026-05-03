export type Cell = [number, number];

const cellKey = (cell: Cell): string => `${cell[0]},${cell[1]}`;

const sameCell = (a: Cell, b: Cell): boolean => a[0] === b[0] && a[1] === b[1];

const isNeighbor = (a: Cell, b: Cell): boolean =>
  !sameCell(a, b) &&
  Math.abs(a[0] - b[0]) <= 1 &&
  Math.abs(a[1] - b[1]) <= 1;

const countLivingNeighbors = (cell: Cell, livingCells: Cell[]): number =>
  livingCells.filter((other) => isNeighbor(cell, other)).length;

const candidateCells = (livingCells: Cell[]): Cell[] => {
  const seen = new Map<string, Cell>();
  for (const [x, y] of livingCells) {
    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        const cell: Cell = [x + dx, y + dy];
        seen.set(cellKey(cell), cell);
      }
    }
  }
  return [...seen.values()];
};

const isAlive = (cell: Cell, livingCells: Cell[]): boolean =>
  livingCells.some((other) => sameCell(cell, other));

const survivesOrIsBorn = (cell: Cell, livingCells: Cell[]): boolean => {
  const n = countLivingNeighbors(cell, livingCells);
  return isAlive(cell, livingCells) ? n === 2 || n === 3 : n === 3;
};

export const nextGeneration = (cells: Cell[]): Cell[] =>
  candidateCells(cells).filter((cell) => survivesOrIsBorn(cell, cells));
