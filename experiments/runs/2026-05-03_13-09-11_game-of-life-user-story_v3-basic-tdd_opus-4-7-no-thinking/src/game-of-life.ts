export type Cell = [number, number];

const key = (x: number, y: number): string => `${x},${y}`;

const parseKey = (k: string): Cell => {
  const [x, y] = k.split(',').map(Number);
  return [x, y];
};

const NEIGHBOR_OFFSETS: ReadonlyArray<readonly [number, number]> = [
  [-1, -1], [0, -1], [1, -1],
  [-1, 0], [1, 0],
  [-1, 1], [0, 1], [1, 1],
];

export function nextGeneration(livingCells: Cell[]): Cell[] {
  const alive = new Set<string>(livingCells.map(([x, y]) => key(x, y)));
  const neighborCounts = new Map<string, number>();

  for (const k of alive) {
    const [x, y] = parseKey(k);
    for (const [dx, dy] of NEIGHBOR_OFFSETS) {
      const nKey = key(x + dx, y + dy);
      neighborCounts.set(nKey, (neighborCounts.get(nKey) ?? 0) + 1);
    }
  }

  const next: Cell[] = [];
  for (const [k, count] of neighborCounts) {
    if (count === 3 || (count === 2 && alive.has(k))) {
      next.push(parseKey(k));
    }
  }

  return next;
}
