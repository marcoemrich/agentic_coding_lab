export type Cell = [number, number];

export type Cell = [number, number];

const MIN_SURVIVE_NEIGHBORS = 2;
const MAX_SURVIVE_NEIGHBORS = 3;
const REPRODUCE_NEIGHBORS = 3;

function getNeighbors(x: number, y: number): string[] {
  const neighbors: string[] = [];
  for (let dx = -1; dx <= 1; dx++) {
    for (let dy = -1; dy <= 1; dy++) {
      if (dx !== 0 || dy !== 0) {
        neighbors.push(`${x + dx},${y + dy}`);
      }
    }
  }
  return neighbors;
}

function getNeighborCounts(cells: Cell[]): Map<string, number> {
  const neighborCounts = new Map<string, number>();
  for (const [x, y] of cells) {
    for (const key of getNeighbors(x, y)) {
      neighborCounts.set(key, (neighborCounts.get(key) || 0) + 1);
    }
  }
  return neighborCounts;
}

export function nextGeneration(cells: Cell[]): Cell[] {
  const liveSet = new Set<string>(cells.map(([x, y]) => `${x},${y}`));
  const neighborCounts = getNeighborCounts(cells);
  const nextLiveCells: Cell[] = [];

  for (const [x, y] of cells) {
    const count = neighborCounts.get(`${x},${y}`) || 0;
    if (count === MIN_SURVIVE_NEIGHBORS || count === MAX_SURVIVE_NEIGHBORS) {
      nextLiveCells.push([x, y]);
    }
  }

  for (const [key, count] of neighborCounts.entries()) {
    if (count === REPRODUCE_NEIGHBORS && !liveSet.has(key)) {
      const [xs, ys] = key.split(",");
      nextLiveCells.push([parseInt(xs, 10), parseInt(ys, 10)]);
    }
  }

  return nextLiveCells;
}
