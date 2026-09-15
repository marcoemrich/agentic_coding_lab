export type Cell = [number, number];

const SURVIVAL_NEIGHBOR_COUNT = 2;
const REPRODUCTION_NEIGHBOR_COUNT = 3;
const NEIGHBOR_OFFSETS: Cell[] = [
  [-1, -1], [0, -1], [1, -1],
  [-1, 0], [1, 0],
  [-1, 1], [0, 1], [1, 1],
];

function cellKey([x, y]: Cell): string {
  return `${x},${y}`;
}

function cellFromKey(key: string): Cell {
  const [x, y] = key.split(",").map(Number);
  return [x, y];
}

function neighborCounts(cells: Cell[]): Map<string, number> {
  const counts = new Map<string, number>();
  for (const [x, y] of cells) {
    for (const [offsetX, offsetY] of NEIGHBOR_OFFSETS) {
      const neighbor = cellKey([x + offsetX, y + offsetY]);
      counts.set(neighbor, (counts.get(neighbor) ?? 0) + 1);
    }
  }
  return counts;
}

function survives(neighbors: number): boolean {
  return neighbors === SURVIVAL_NEIGHBOR_COUNT
    || neighbors === REPRODUCTION_NEIGHBOR_COUNT;
}

function isReproduced(neighbors: number): boolean {
  return neighbors === REPRODUCTION_NEIGHBOR_COUNT;
}

function livesInNextGeneration(neighbors: number, currentlyAlive: boolean): boolean {
  return currentlyAlive ? survives(neighbors) : isReproduced(neighbors);
}

export function nextGeneration(cells: Cell[]): Cell[] {
  const livingCells = new Set(cells.map(cellKey));
  return [...neighborCounts(cells)]
    .filter(([key, count]) => livesInNextGeneration(count, livingCells.has(key)))
    .map(([key]) => cellFromKey(key));
}
