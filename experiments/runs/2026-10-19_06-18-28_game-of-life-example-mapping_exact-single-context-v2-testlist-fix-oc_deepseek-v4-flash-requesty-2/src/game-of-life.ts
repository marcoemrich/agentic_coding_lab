export type Cell = [number, number];

const NEIGHBORS: Cell[] = [
  [-1, -1], [0, -1], [1, -1],
  [-1, 0], [1, 0],
  [-1, 1], [0, 1], [1, 1],
];

const REPRODUCTION_COUNT = 3;
const SURVIVAL_COUNT = 2;

export function nextGeneration(cells: Cell[]): Cell[] {
  const live = new Set(cells.map(([x, y]) => `${x},${y}`));
  const neighborCounts = new Map<string, number>();

  for (const [x, y] of cells) {
    for (const [dx, dy] of NEIGHBORS) {
      const key = `${x + dx},${y + dy}`;
      neighborCounts.set(key, (neighborCounts.get(key) ?? 0) + 1);
    }
  }

  const next: Cell[] = [];
  for (const [key, count] of neighborCounts) {
    const currentlyAlive = live.has(key);
    if (
      count === REPRODUCTION_COUNT ||
      (currentlyAlive && count === SURVIVAL_COUNT)
    ) {
      const [x, y] = key.split(",").map(Number);
      next.push([x, y]);
    }
  }

  return next;
}