type Cell = [number, number];

type NeighborCount = {
  cell: Cell;
  count: number;
};

const MINIMUM_SURVIVAL_NEIGHBORS = 2;
const MAXIMUM_SURVIVAL_NEIGHBORS = 3;
const REPRODUCTION_NEIGHBORS = 3;
const NEIGHBOR_OFFSETS: Cell[] = [
  [-1, -1], [-1, 0], [-1, 1],
  [0, -1], [0, 1],
  [1, -1], [1, 0], [1, 1],
];

function coordinateKey([x, y]: Cell): string {
  return `${x},${y}`;
}

function countCandidateNeighbors(cells: Cell[]): Map<string, NeighborCount> {
  const counts = new Map<string, NeighborCount>();
  for (const [x, y] of cells) {
    for (const [deltaX, deltaY] of NEIGHBOR_OFFSETS) {
      const neighbor: Cell = [x + deltaX, y + deltaY];
      const key = coordinateKey(neighbor);
      const count = (counts.get(key)?.count ?? 0) + 1;
      counts.set(key, { cell: neighbor, count });
    }
  }
  return counts;
}

function survives(liveNeighbors: number): boolean {
  return liveNeighbors >= MINIMUM_SURVIVAL_NEIGHBORS
    && liveNeighbors <= MAXIMUM_SURVIVAL_NEIGHBORS;
}

function reproduces(liveNeighbors: number): boolean {
  return liveNeighbors === REPRODUCTION_NEIGHBORS;
}

export function nextGeneration(cells: Cell[]): Cell[] {
  const livingCells = new Set(cells.map(coordinateKey));
  return [...countCandidateNeighbors(cells).values()]
    .filter(({ cell, count }) => livingCells.has(coordinateKey(cell))
      ? survives(count)
      : reproduces(count))
    .map(({ cell }) => cell);
}
