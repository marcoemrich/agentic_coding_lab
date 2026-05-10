type Cell = [number, number];
type CellSet = Set<string>;

function key(x: number, y: number): string {
  return `${x},${y}`;
}

function neighbors(x: number, y: number): Cell[] {
  return [
    [x - 1, y - 1], [x, y - 1], [x + 1, y - 1],
    [x - 1, y],                  [x + 1, y],
    [x - 1, y + 1], [x, y + 1], [x + 1, y + 1],
  ];
}

export function nextGeneration(living: Cell[]): Cell[] {
  const alive: CellSet = new Set(living.map(([x, y]) => key(x, y)));
  const neighborCount = new Map<string, number>();

  for (const [x, y] of living) {
    for (const [nx, ny] of neighbors(x, y)) {
      const k = key(nx, ny);
      neighborCount.set(k, (neighborCount.get(k) ?? 0) + 1);
    }
  }

  const result: Cell[] = [];
  for (const [k, count] of neighborCount) {
    if (count === 3 || (count === 2 && alive.has(k))) {
      const [x, y] = k.split(',').map(Number) as [number, number];
      result.push([x, y]);
    }
  }
  return result;
}
