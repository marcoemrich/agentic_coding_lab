export type Cell = [number, number];

type Candidate = {
  cell: Cell;
  liveNeighborCount: number;
};

const SURVIVAL_NEIGHBOR_COUNT = 2;
const REPRODUCTION_NEIGHBOR_COUNT = 3;
const OFFSETS = [-1, 0, 1];

function cellKey([x, y]: Cell): string {
  return `${x},${y}`;
}

function neighboringCells([x, y]: Cell): Cell[] {
  const neighbors: Cell[] = [];
  for (const deltaX of OFFSETS) {
    for (const deltaY of OFFSETS) {
      if (deltaX !== 0 || deltaY !== 0) neighbors.push([x + deltaX, y + deltaY]);
    }
  }
  return neighbors;
}

function willBeAlive(isAlive: boolean, liveNeighborCount: number): boolean {
  return liveNeighborCount === REPRODUCTION_NEIGHBOR_COUNT
    || (isAlive && liveNeighborCount === SURVIVAL_NEIGHBOR_COUNT);
}

export function nextGeneration(cells: Cell[]): Cell[] {
  const livingCells = new Set(cells.map(cellKey));
  const candidates = new Map<string, Candidate>();

  for (const livingCell of cells) {
    for (const cell of neighboringCells(livingCell)) {
      const key = cellKey(cell);
      const candidate = candidates.get(key) ?? { cell, liveNeighborCount: 0 };
      candidate.liveNeighborCount += 1;
      candidates.set(key, candidate);
    }
  }

  return [...candidates.entries()]
    .filter(([key, candidate]) => willBeAlive(livingCells.has(key), candidate.liveNeighborCount))
    .map(([, { cell }]) => cell);
}
