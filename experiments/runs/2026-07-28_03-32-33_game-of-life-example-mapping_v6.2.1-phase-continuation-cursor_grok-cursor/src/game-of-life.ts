export type Cell = [number, number];

const NEIGHBOR_OFFSETS: Cell[] = [
  [-1, -1], [0, -1], [1, -1],
  [-1, 0],           [1, 0],
  [-1, 1],  [0, 1],  [1, 1],
];

function cellKey(x: number, y: number): string {
  return `${x},${y}`;
}

function willLive(isAlive: boolean, neighborCount: number): boolean {
  if (isAlive) {
    return neighborCount === 2 || neighborCount === 3;
  }
  return neighborCount === 3;
}

export function nextGeneration(liveCells: Cell[]): Cell[] {
  const live = new Set(liveCells.map(([x, y]) => cellKey(x, y)));
  const neighborCounts = new Map<string, number>();

  for (const [x, y] of liveCells) {
    for (const [dx, dy] of NEIGHBOR_OFFSETS) {
      const key = cellKey(x + dx, y + dy);
      neighborCounts.set(key, (neighborCounts.get(key) ?? 0) + 1);
    }
  }

  const next: Cell[] = [];
  for (const [key, count] of neighborCounts) {
    const isAlive = live.has(key);
    if (willLive(isAlive, count)) {
      const [x, y] = key.split(",").map(Number) as [number, number];
      next.push([x, y]);
    }
  }
  return next;
}
