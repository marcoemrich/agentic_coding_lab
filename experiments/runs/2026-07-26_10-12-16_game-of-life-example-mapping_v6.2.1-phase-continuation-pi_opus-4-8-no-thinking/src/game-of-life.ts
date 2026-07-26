type Cell = [number, number]; // [x, y]

const SURVIVAL_NEIGHBORS = 2;
const REPRODUCTION_NEIGHBORS = 3;

const NEIGHBOR_OFFSETS: Cell[] = [
  [-1, -1], [0, -1], [1, -1],
  [-1, 0], [1, 0],
  [-1, 1], [0, 1], [1, 1],
];

function toKey([x, y]: Cell): string {
  return `${x},${y}`;
}

function fromKey(key: string): Cell {
  const [x, y] = key.split(",").map(Number);
  return [x, y];
}

function countNeighbors(cells: Cell[]): Map<string, number> {
  const neighborCounts = new Map<string, number>();
  for (const [x, y] of cells) {
    for (const [dx, dy] of NEIGHBOR_OFFSETS) {
      const key = toKey([x + dx, y + dy]);
      neighborCounts.set(key, (neighborCounts.get(key) ?? 0) + 1);
    }
  }
  return neighborCounts;
}

function isAliveNextGeneration(count: number, isCurrentlyAlive: boolean): boolean {
  const survives = isCurrentlyAlive && count === SURVIVAL_NEIGHBORS;
  const reproduces = count === REPRODUCTION_NEIGHBORS;
  return survives || reproduces;
}

export function nextGeneration(cells: Cell[]): Cell[] {
  const alive = new Set(cells.map(toKey));
  const neighborCounts = countNeighbors(cells);

  const result: Cell[] = [];
  for (const [key, count] of neighborCounts) {
    if (isAliveNextGeneration(count, alive.has(key))) {
      result.push(fromKey(key));
    }
  }
  return result;
}
