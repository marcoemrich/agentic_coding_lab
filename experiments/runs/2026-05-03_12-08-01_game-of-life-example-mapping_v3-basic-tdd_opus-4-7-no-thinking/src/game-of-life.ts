export type Cell = [number, number];

const NEIGHBOR_OFFSETS: ReadonlyArray<readonly [number, number]> = [
  [-1, -1], [0, -1], [1, -1],
  [-1, 0],           [1, 0],
  [-1, 1],  [0, 1],  [1, 1],
];

const key = (x: number, y: number): string => `${x},${y}`;

export function nextGeneration(cells: ReadonlyArray<Cell>): Cell[] {
  const live = new Set<string>(cells.map(([x, y]) => key(x, y)));
  const neighborCounts = new Map<string, number>();

  for (const [x, y] of cells) {
    for (const [dx, dy] of NEIGHBOR_OFFSETS) {
      const nx = x + dx;
      const ny = y + dy;
      const k = key(nx, ny);
      neighborCounts.set(k, (neighborCounts.get(k) ?? 0) + 1);
    }
  }

  const next: Cell[] = [];
  for (const [k, count] of neighborCounts) {
    const isAlive = live.has(k);
    if (count === 3 || (count === 2 && isAlive)) {
      const [xs, ys] = k.split(',');
      next.push([Number(xs), Number(ys)]);
    }
  }

  return next;
}
