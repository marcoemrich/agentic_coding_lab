export type Cell = [number, number];

const toKey = (x: number, y: number) => `${x},${y}`;
const fromKey = (key: string): Cell => key.split(",").map(Number) as Cell;

export function nextGeneration(cells: Cell[]): Cell[] {
  const live = new Set(cells.map(([x, y]) => toKey(x, y)));
  const neighborCounts = new Map<string, number>();

  for (const [x, y] of cells) {
    for (const [dx, dy] of NEIGHBORS) {
      const key = toKey(x + dx, y + dy);
      neighborCounts.set(key, (neighborCounts.get(key) ?? 0) + 1);
    }
  }

  const next: Cell[] = [];
  for (const [key, count] of neighborCounts) {
    if (count === 3 || (count === 2 && live.has(key))) {
      next.push(fromKey(key));
    }
  }
  return next;
}

const NEIGHBORS: [number, number][] = [
  [-1, -1], [0, -1], [1, -1],
  [-1, 0],           [1, 0],
  [-1, 1],  [0, 1],  [1, 1],
];