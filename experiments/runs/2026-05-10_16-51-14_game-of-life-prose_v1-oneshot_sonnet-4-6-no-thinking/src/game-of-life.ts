type Cell = [number, number];

function cellKey(x: number, y: number): string {
  return `${x},${y}`;
}

function neighbors(x: number, y: number): Cell[] {
  return [
    [x - 1, y - 1], [x, y - 1], [x + 1, y - 1],
    [x - 1, y],                  [x + 1, y],
    [x - 1, y + 1], [x, y + 1], [x + 1, y + 1],
  ];
}

export function nextGeneration(livingCells: Cell[]): Cell[] {
  const alive = new Set(livingCells.map(([x, y]) => cellKey(x, y)));
  const neighborCount = new Map<string, number>();

  for (const [x, y] of livingCells) {
    for (const [nx, ny] of neighbors(x, y)) {
      const key = cellKey(nx, ny);
      neighborCount.set(key, (neighborCount.get(key) ?? 0) + 1);
    }
  }

  const result: Cell[] = [];
  for (const [key, count] of neighborCount) {
    const [x, y] = key.split(',').map(Number) as [number, number];
    if (count === 3 || (count === 2 && alive.has(key))) {
      result.push([x, y]);
    }
  }

  return result;
}
