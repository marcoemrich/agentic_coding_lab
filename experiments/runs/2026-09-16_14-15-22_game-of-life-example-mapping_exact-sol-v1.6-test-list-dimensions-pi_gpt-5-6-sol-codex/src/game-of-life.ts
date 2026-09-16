export type Cell = [number, number];

const MINIMUM_SURVIVAL_NEIGHBORS = 2;
const MAXIMUM_SURVIVAL_NEIGHBORS = 3;
const REPRODUCTION_NEIGHBORS = 3;
const NEIGHBOR_OFFSETS: Cell[] = [
  [-1, -1], [0, -1], [1, -1],
  [-1, 0],           [1, 0],
  [-1, 1],  [0, 1],  [1, 1],
];

function countLiveNeighbors([x, y]: Cell, cells: Cell[]): number {
  return cells.filter(([otherX, otherY]) =>
    !(x === otherX && y === otherY)
    && Math.abs(x - otherX) <= 1
    && Math.abs(y - otherY) <= 1
  ).length;
}

function survives(liveNeighbors: number): boolean {
  return liveNeighbors >= MINIMUM_SURVIVAL_NEIGHBORS
    && liveNeighbors <= MAXIMUM_SURVIVAL_NEIGHBORS;
}

function coordinateKey([x, y]: Cell): string {
  return `${x},${y}`;
}

function reproductionCandidates(cells: Cell[]): Cell[] {
  const candidates = new Map<string, Cell>();
  for (const [x, y] of cells) {
    for (const [offsetX, offsetY] of NEIGHBOR_OFFSETS) {
      const candidate: Cell = [x + offsetX, y + offsetY];
      candidates.set(coordinateKey(candidate), candidate);
    }
  }
  return [...candidates.values()];
}

function isAlive(cell: Cell, cells: Cell[]): boolean {
  return cells.some(([x, y]) => x === cell[0] && y === cell[1]);
}

function isBorn(cell: Cell, cells: Cell[]): boolean {
  return !isAlive(cell, cells)
    && countLiveNeighbors(cell, cells) === REPRODUCTION_NEIGHBORS;
}

export function nextGeneration(cells: Cell[]): Cell[] {
  const survivors = cells.filter((cell) => survives(countLiveNeighbors(cell, cells)));
  const births = reproductionCandidates(cells).filter((cell) => isBorn(cell, cells));
  return [...survivors, ...births];
}
