export type Cell = [number, number];

const MINIMUM_SURVIVAL_NEIGHBOR_COUNT = 2;
const MAXIMUM_SURVIVAL_NEIGHBOR_COUNT = 3;
const REPRODUCTION_NEIGHBOR_COUNT = 3;

function cellKey([x, y]: Cell): string {
  return `${x},${y}`;
}

function neighboringCells([x, y]: Cell): Cell[] {
  const neighbors: Cell[] = [];

  for (let dx = -1; dx <= 1; dx += 1) {
    for (let dy = -1; dy <= 1; dy += 1) {
      if (dx === 0 && dy === 0) continue;
      neighbors.push([x + dx, y + dy]);
    }
  }

  return neighbors;
}

type LiveNeighborCounts = Map<string, { cell: Cell; count: number }>;

function countLiveNeighborsByCell(cells: Cell[]): LiveNeighborCounts {
  const neighborCounts: LiveNeighborCounts = new Map();

  for (const liveCell of cells) {
    for (const neighbor of neighboringCells(liveCell)) {
      const key = cellKey(neighbor);
      const previousCount = neighborCounts.get(key)?.count ?? 0;
      neighborCounts.set(key, { cell: neighbor, count: previousCount + 1 });
    }
  }

  return neighborCounts;
}

function findBirths(cells: Cell[], neighborCounts: LiveNeighborCounts): Cell[] {
  const liveCells = new Set(cells.map(cellKey));
  return [...neighborCounts.entries()]
    .filter(([key, candidate]) => !liveCells.has(key)
      && candidate.count === REPRODUCTION_NEIGHBOR_COUNT)
    .map(([, candidate]) => candidate.cell);
}

function findSurvivors(cells: Cell[], neighborCounts: LiveNeighborCounts): Cell[] {
  return cells.filter((cell) => {
    const liveNeighborCount = neighborCounts.get(cellKey(cell))?.count ?? 0;
    return liveNeighborCount >= MINIMUM_SURVIVAL_NEIGHBOR_COUNT
      && liveNeighborCount <= MAXIMUM_SURVIVAL_NEIGHBOR_COUNT;
  });
}

export function nextGeneration(cells: Cell[]): Cell[] {
  const neighborCounts = countLiveNeighborsByCell(cells);
  return [
    ...findSurvivors(cells, neighborCounts),
    ...findBirths(cells, neighborCounts),
  ];
}
