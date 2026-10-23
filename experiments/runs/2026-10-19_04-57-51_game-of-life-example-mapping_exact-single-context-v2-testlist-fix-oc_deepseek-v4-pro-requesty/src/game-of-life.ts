export type Cell = [number, number];

const key = (x: number, y: number): string => `${x},${y}`;

const toCell = (k: string): Cell => {
  const [x, y] = k.split(",").map(Number);
  return [x, y];
};

const NEIGHBORS = [
  [-1, -1], [-1, 0], [-1, 1],
  [0, -1], [0, 1],
  [1, -1], [1, 0], [1, 1],
];

function countNeighbors(cells: Cell[]): Map<string, number> {
  const counts = new Map<string, number>();
  for (const [x, y] of cells) {
    for (const [dx, dy] of NEIGHBORS) {
      const k = key(x + dx, y + dy);
      counts.set(k, (counts.get(k) ?? 0) + 1);
    }
  }
  return counts;
}

const SURVIVAL_MIN = 2;
const SURVIVAL_MAX = 3;
const REPRODUCTION = 3;

export function nextGeneration(cells: Cell[]): Cell[] {
  const live = new Set(cells.map(([x, y]) => key(x, y)));
  const neighborCounts = countNeighbors(cells);
  const next = new Set<string>();

  for (const [x, y] of cells) {
    const k = key(x, y);
    const n = neighborCounts.get(k) ?? 0;
    if (n >= SURVIVAL_MIN && n <= SURVIVAL_MAX) {
      next.add(k);
    }
  }

  for (const [k, count] of neighborCounts) {
    if (count === REPRODUCTION && !live.has(k)) {
      next.add(k);
    }
  }

  return [...next].map(toCell).sort((a, b) => a[0] - b[0] || a[1] - b[1]);
}