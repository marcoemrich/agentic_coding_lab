type Cell = [number, number];

export function nextGeneration(cells: Cell[]): Cell[] {
  const alive = new Set<string>(cells.map(([x, y]) => `${x},${y}`));

  // Count neighbors for all candidate cells (living cells and their neighbors)
  const neighborCount = new Map<string, number>();

  for (const [x, y] of cells) {
    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        if (dx === 0 && dy === 0) continue;
        const key = `${x + dx},${y + dy}`;
        neighborCount.set(key, (neighborCount.get(key) ?? 0) + 1);
      }
    }
  }

  const next: Cell[] = [];

  for (const [key, count] of neighborCount) {
    const isAlive = alive.has(key);
    if ((isAlive && (count === 2 || count === 3)) || (!isAlive && count === 3)) {
      const [x, y] = key.split(',').map(Number);
      next.push([x, y]);
    }
  }

  return next;
}
