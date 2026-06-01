export type Cell = [number, number]; // [x, y]

const toKey = ([x, y]: Cell): string => `${x},${y}`;

const NEIGHBOR_OFFSETS: Cell[] = [
  [-1, -1], [-1, 0], [-1, 1],
  [0, -1],           [0, 1],
  [1, -1],  [1, 0],  [1, 1],
];

function neighborsOf([x, y]: Cell): Cell[] {
  return NEIGHBOR_OFFSETS.map(([dx, dy]) => [x + dx, y + dy]);
}

function countLiveNeighbors(cell: Cell, living: Set<string>): number {
  return neighborsOf(cell).filter((n) => living.has(toKey(n))).length;
}

const REPRODUCTION_NEIGHBORS = 3;
const SURVIVAL_NEIGHBORS = 2;

function isAliveNextGeneration(isAlive: boolean, liveNeighbors: number): boolean {
  return (
    liveNeighbors === REPRODUCTION_NEIGHBORS ||
    (isAlive && liveNeighbors === SURVIVAL_NEIGHBORS)
  );
}

function candidateCells(cells: Cell[]): Cell[] {
  const candidates = new Map<string, Cell>();
  for (const cell of cells) {
    candidates.set(toKey(cell), cell);
    for (const neighbor of neighborsOf(cell)) candidates.set(toKey(neighbor), neighbor);
  }
  return [...candidates.values()];
}

export function nextGeneration(cells: Cell[]): Cell[] {
  const living = new Set(cells.map(toKey));
  const isLiving = (cell: Cell): boolean => living.has(toKey(cell));

  const willBeAlive = (cell: Cell): boolean =>
    isAliveNextGeneration(isLiving(cell), countLiveNeighbors(cell, living));

  return candidateCells(cells).filter(willBeAlive);
}
