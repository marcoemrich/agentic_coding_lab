type Cell = [number, number];

function getNeighbors(x: number, y: number): Cell[] {
  return [
    [x - 1, y - 1], [x, y - 1], [x + 1, y - 1],
    [x - 1, y],                  [x + 1, y],
    [x - 1, y + 1], [x, y + 1], [x + 1, y + 1],
  ];
}

export function nextGeneration(cells: Cell[]): Cell[] {
  const liveSet = new Set(cells.map(([x, y]) => `${x},${y}`));

  const neighborCount = new Map<string, number>();

  for (const [x, y] of cells) {
    for (const [nx, ny] of getNeighbors(x, y)) {
      const key = `${nx},${ny}`;
      neighborCount.set(key, (neighborCount.get(key) ?? 0) + 1);
    }
  }

  const result: Cell[] = [];

  for (const [key, count] of neighborCount) {
    const [x, y] = key.split(',').map(Number) as [number, number];
    const isAlive = liveSet.has(key);
    if (isAlive && (count === 2 || count === 3)) {
      result.push([x, y]);
    } else if (!isAlive && count === 3) {
      result.push([x, y]);
    }
  }

  return result;
}
