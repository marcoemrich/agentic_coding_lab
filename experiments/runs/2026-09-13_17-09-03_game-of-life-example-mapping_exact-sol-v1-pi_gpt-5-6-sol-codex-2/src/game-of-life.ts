export type Cell = [number, number];

const MIN_SURVIVAL_NEIGHBORS = 2;
const REPRODUCTION_NEIGHBORS = 3;
const NEIGHBOR_OFFSETS: Cell[] = [
  [-1, -1], [0, -1], [1, -1],
  [-1, 0],           [1, 0],
  [-1, 1],  [0, 1],  [1, 1],
];

function keyOf([x, y]: Cell): string {
  return `${x},${y}`;
}

function cellFrom(key: string): Cell {
  const [x, y] = key.split(",").map(Number);
  return [x, y];
}

function livesNext(neighborCount: number, currentlyAlive: boolean): boolean {
  return neighborCount === REPRODUCTION_NEIGHBORS
    || currentlyAlive
      && neighborCount >= MIN_SURVIVAL_NEIGHBORS
      && neighborCount <= REPRODUCTION_NEIGHBORS;
}

export function nextGeneration(cells: Cell[]): Cell[] {
  const living = new Set(cells.map(keyOf));
  const neighborCounts = new Map<string, number>();

  for (const [x, y] of cells) {
    for (const [dx, dy] of NEIGHBOR_OFFSETS) {
      const neighbor = keyOf([x + dx, y + dy]);
      neighborCounts.set(neighbor, (neighborCounts.get(neighbor) ?? 0) + 1);
    }
  }

  return [...neighborCounts]
    .filter(([key, count]) => livesNext(count, living.has(key)))
    .map(([key]) => cellFrom(key));
}
