// game-of-life.ts

export type Cell = [number, number];

function isNeighbor(cell: Cell, other: Cell): boolean {
  const [x, y] = cell;
  const [ox, oy] = other;
  if (ox === x && oy === y) return false;
  return Math.abs(ox - x) <= 1 && Math.abs(oy - y) <= 1;
}

function countLiveNeighbors(cell: Cell, liveCells: Cell[]): number {
  return liveCells.filter((other) => isNeighbor(cell, other)).length;
}

function survives(cell: Cell, liveCells: Cell[]): boolean {
  const neighbors = countLiveNeighbors(cell, liveCells);
  return neighbors === 2 || neighbors === 3;
}

function isLive(cell: Cell, liveCells: Cell[]): boolean {
  return liveCells.some(([x, y]) => x === cell[0] && y === cell[1]);
}

function cellKey(cell: Cell): string {
  return `${cell[0]},${cell[1]}`;
}

const NEIGHBOR_OFFSETS: ReadonlyArray<[number, number]> = [
  [-1, -1], [-1, 0], [-1, 1],
  [0, -1],           [0, 1],
  [1, -1],  [1, 0],  [1, 1],
];

function neighborsOf(cell: Cell): Cell[] {
  const [x, y] = cell;
  return NEIGHBOR_OFFSETS.map(([dx, dy]) => [x + dx, y + dy]);
}

function uniqueCells(cells: Cell[]): Cell[] {
  const unique = new Map<string, Cell>();
  cells.forEach((cell) => unique.set(cellKey(cell), cell));
  return [...unique.values()];
}

function deadNeighborsOf(liveCells: Cell[]): Cell[] {
  const allNeighbors = liveCells.flatMap(neighborsOf);
  const deadNeighbors = allNeighbors.filter((cell) => !isLive(cell, liveCells));
  return uniqueCells(deadNeighbors);
}

function isBorn(cell: Cell, liveCells: Cell[]): boolean {
  return countLiveNeighbors(cell, liveCells) === 3;
}

export function nextGeneration(liveCells: Cell[]): Cell[] {
  const survivors = liveCells.filter((cell) => survives(cell, liveCells));
  const births = deadNeighborsOf(liveCells).filter((cell) => isBorn(cell, liveCells));
  return [...survivors, ...births];
}
