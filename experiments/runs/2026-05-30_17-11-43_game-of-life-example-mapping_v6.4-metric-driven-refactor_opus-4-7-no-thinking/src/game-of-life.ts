export type Cell = [number, number];

const NEIGHBOR_OFFSETS: ReadonlyArray<[number, number]> = [
  [-1, -1], [-1, 0], [-1, 1],
  [ 0, -1],          [ 0, 1],
  [ 1, -1], [ 1, 0], [ 1, 1],
];

const SURVIVAL_MIN_NEIGHBORS = 2;
const SURVIVAL_MAX_NEIGHBORS = 3;
const SURVIVAL_NEIGHBOR_COUNTS: ReadonlyArray<number> = [
  SURVIVAL_MIN_NEIGHBORS,
  SURVIVAL_MAX_NEIGHBORS,
];

const REPRODUCTION_NEIGHBORS = 3;

export function nextGeneration(cells: Cell[]): Cell[] {
  const liveKeys = new Set(cells.map(cellKey));
  const isAlive = (cell: Cell): boolean => liveKeys.has(cellKey(cell));
  const survivesOrIsBorn = (cell: Cell): boolean =>
    isAliveNextGeneration(isAlive(cell), countLiveNeighbors(cell, isAlive));
  return candidateCells(cells).filter(survivesOrIsBorn);
}

function isAliveNextGeneration(alive: boolean, liveNeighbors: number): boolean {
  return alive
    ? SURVIVAL_NEIGHBOR_COUNTS.includes(liveNeighbors)
    : liveNeighbors === REPRODUCTION_NEIGHBORS;
}

function countLiveNeighbors(cell: Cell, isAlive: (c: Cell) => boolean): number {
  return neighborsOf(cell).filter(isAlive).length;
}

function cellKey([x, y]: Cell): string {
  return `${x},${y}`;
}

function neighborsOf([x, y]: Cell): Cell[] {
  return NEIGHBOR_OFFSETS.map(([dx, dy]) => [x + dx, y + dy]);
}

function candidateCells(liveCells: Cell[]): Cell[] {
  const allCells = liveCells.flatMap((cell) => [cell, ...neighborsOf(cell)]);
  return deduplicateCells(allCells);
}

function deduplicateCells(cells: Cell[]): Cell[] {
  const byKey = new Map<string, Cell>(cells.map((cell) => [cellKey(cell), cell]));
  return [...byKey.values()];
}
