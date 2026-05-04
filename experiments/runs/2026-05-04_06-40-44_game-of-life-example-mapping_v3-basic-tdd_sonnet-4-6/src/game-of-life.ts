type Cell = [number, number];

export function nextGeneration(cells: Cell[]): Cell[] {
  const alive = new Set(cells.map(([x, y]) => `${x},${y}`));

  const neighborCounts = new Map<string, number>();

  for (const [x, y] of cells) {
    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        if (dx === 0 && dy === 0) continue;
        const key = `${x + dx},${y + dy}`;
        neighborCounts.set(key, (neighborCounts.get(key) ?? 0) + 1);
      }
    }
  }

  const next: Cell[] = [];

  for (const [key, count] of neighborCounts) {
    if (count === 3 || (count === 2 && alive.has(key))) {
      const [x, y] = key.split(',').map(Number);
      next.push([x, y]);
    }
  }

  return next;
}
