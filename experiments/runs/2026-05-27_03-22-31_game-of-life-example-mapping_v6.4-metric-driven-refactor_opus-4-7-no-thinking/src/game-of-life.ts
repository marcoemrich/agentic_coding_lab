export type Cell = [number, number];

const SURVIVAL_MIN_NEIGHBORS = 2;
const SURVIVAL_MAX_NEIGHBORS = 3;
const BIRTH_NEIGHBOR_COUNT = 3;

const NEIGHBOR_OFFSETS: ReadonlyArray<Cell> = [
  [-1, -1], [-1, 0], [-1, 1],
  [0, -1],           [0, 1],
  [1, -1],  [1, 0],  [1, 1],
];

function cellKey([x, y]: Cell): string {
  return `${x},${y}`;
}

function neighborsOf([x, y]: Cell): Cell[] {
  return NEIGHBOR_OFFSETS.map(([dx, dy]) => [x + dx, y + dy]);
}

function countLiveNeighbors(cell: Cell, liveSet: Set<string>): number {
  return neighborsOf(cell).filter((neighbor) => liveSet.has(cellKey(neighbor))).length;
}

function livesNextGeneration(cell: Cell, liveSet: Set<string>): boolean {
  const neighborCount = countLiveNeighbors(cell, liveSet);
  const isAlive = liveSet.has(cellKey(cell));
  const survivalRange = neighborCount === SURVIVAL_MIN_NEIGHBORS || neighborCount === SURVIVAL_MAX_NEIGHBORS;
  return isAlive ? survivalRange : neighborCount === BIRTH_NEIGHBOR_COUNT;
}

function uniqueCellsByKey(cells: Cell[]): Cell[] {
  return [...new Map(cells.map((cell) => [cellKey(cell), cell])).values()];
}

function candidateCells(liveCells: Cell[]): Cell[] {
  return uniqueCellsByKey([...liveCells, ...liveCells.flatMap(neighborsOf)]);
}

export function nextGeneration(cells: Cell[]): Cell[] {
  const liveSet = new Set(cells.map(cellKey));
  return candidateCells(cells).filter((cell) => livesNextGeneration(cell, liveSet));
}
