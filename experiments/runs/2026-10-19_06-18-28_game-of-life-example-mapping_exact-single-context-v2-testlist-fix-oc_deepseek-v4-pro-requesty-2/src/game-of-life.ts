export type Cell = [number, number];

const NEIGHBOR_OFFSETS: ReadonlyArray<readonly [number, number]> = [
  [-1, -1], [-1, 0], [-1, 1],
  [0, -1], [0, 1],
  [1, -1], [1, 0], [1, 1],
];

const MIN_SURVIVAL_NEIGHBORS = 2;
const MAX_SURVIVAL_NEIGHBORS = 3;

function toKey(x: number, y: number): string {
  return `${x},${y}`;
}

function countNeighbors(cells: Cell[]): Map<string, number> {
  const counts = new Map<string, number>();

  for (const [x, y] of cells) {
    for (const [dx, dy] of NEIGHBOR_OFFSETS) {
      const key = toKey(x + dx, y + dy);
      counts.set(key, (counts.get(key) ?? 0) + 1);
    }
  }

  return counts;
}

function survivesOrReproduces(count: number, isAlive: boolean): boolean {
  if (isAlive) {
    return count >= MIN_SURVIVAL_NEIGHBORS && count <= MAX_SURVIVAL_NEIGHBORS;
  }
  return count === MAX_SURVIVAL_NEIGHBORS;
}

export function nextGeneration(cells: Cell[]): Cell[] {
  const live = new Set(cells.map(([x, y]) => toKey(x, y)));
  const neighborCounts = countNeighbors(cells);
  const next: Cell[] = [];

  for (const [key, count] of neighborCounts) {
    if (survivesOrReproduces(count, live.has(key))) {
      const [x, y] = key.split(",");
      next.push([Number(x), Number(y)]);
    }
  }

  return next.sort(([ax, ay], [bx, by]) => ax - bx || ay - by);
}