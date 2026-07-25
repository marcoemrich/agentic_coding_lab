type Cell = [number, number];

function cellKey(x: number, y: number): string {
  return `${x},${y}`;
}

function parseKey(key: string): Cell {
  const [x, y] = key.split(",").map(Number);
  return [x, y];
}

function neighborsOf(x: number, y: number): Cell[] {
  return [
    [x - 1, y - 1], [x, y - 1], [x + 1, y - 1],
    [x - 1, y],                 [x + 1, y],
    [x - 1, y + 1], [x, y + 1], [x + 1, y + 1],
  ];
}

function willBeAliveNext(neighborCount: number, isCurrentlyAlive: boolean): boolean {
  return neighborCount === 3 || (isCurrentlyAlive && neighborCount === 2);
}

function compareCells([ax, ay]: Cell, [bx, by]: Cell): number {
  return (ax - bx) || (ay - by);
}

export function nextGeneration(liveCells: Cell[]): Cell[] {
  const liveKeys = new Set(liveCells.map(([x, y]) => cellKey(x, y)));
  const neighborCounts = new Map<string, number>();

  for (const [x, y] of liveCells) {
    for (const [nx, ny] of neighborsOf(x, y)) {
      const key = cellKey(nx, ny);
      neighborCounts.set(key, (neighborCounts.get(key) ?? 0) + 1);
    }
  }

  const next: Cell[] = [];
  for (const [key, count] of neighborCounts) {
    if (willBeAliveNext(count, liveKeys.has(key))) {
      next.push(parseKey(key));
    }
  }

  return next.sort(compareCells);
}
