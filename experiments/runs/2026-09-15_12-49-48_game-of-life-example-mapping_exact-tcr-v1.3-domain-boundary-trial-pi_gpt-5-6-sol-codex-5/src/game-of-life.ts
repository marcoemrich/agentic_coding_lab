export type Cell = [number, number];

type Candidate = {
  cell: Cell;
  liveNeighbors: number;
};

const MINIMUM_SURVIVAL_NEIGHBORS = 2;
const REPRODUCTION_NEIGHBORS = 3;
const NEIGHBOR_OFFSETS: Cell[] = [
  [-1, -1], [-1, 0], [-1, 1],
  [0, -1], [0, 1],
  [1, -1], [1, 0], [1, 1],
];

function cellKey([x, y]: Cell): string {
  return `${x},${y}`;
}

function isAliveInNextGeneration(liveNeighbors: number, isCurrentlyAlive: boolean): boolean {
  return liveNeighbors === REPRODUCTION_NEIGHBORS
    || (liveNeighbors === MINIMUM_SURVIVAL_NEIGHBORS && isCurrentlyAlive);
}

function countLiveNeighbors(cells: Cell[]): Map<string, Candidate> {
  const candidates = new Map<string, Candidate>();
  for (const [x, y] of cells) {
    for (const [dx, dy] of NEIGHBOR_OFFSETS) {
      const neighbor: Cell = [x + dx, y + dy];
      const key = cellKey(neighbor);
      const candidate = candidates.get(key) ?? { cell: neighbor, liveNeighbors: 0 };
      candidate.liveNeighbors += 1;
      candidates.set(key, candidate);
    }
  }
  return candidates;
}

export function nextGeneration(cells: Cell[]): Cell[] {
  const livingCellKeys = new Set(cells.map(cellKey));
  return [...countLiveNeighbors(cells).entries()]
    .filter(([key, { liveNeighbors }]) =>
      isAliveInNextGeneration(liveNeighbors, livingCellKeys.has(key)))
    .map(([, { cell }]) => cell);
}
