type Cell = [number, number];

function cellKey(x: number, y: number): string {
  return `${x},${y}`;
}

export function nextGeneration(livingCells: Cell[]): Cell[] {
  const alive = new Set<string>(livingCells.map(([x, y]) => cellKey(x, y)));
  const neighborCount = new Map<string, number>();

  for (const [x, y] of livingCells) {
    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        if (dx === 0 && dy === 0) continue;
        const key = cellKey(x + dx, y + dy);
        neighborCount.set(key, (neighborCount.get(key) ?? 0) + 1);
      }
    }
  }

  const result: Cell[] = [];
  for (const [key, count] of neighborCount) {
    if (count === 3 || (count === 2 && alive.has(key))) {
      const [x, y] = key.split(',').map(Number);
      result.push([x, y]);
    }
  }

  return result;
}
