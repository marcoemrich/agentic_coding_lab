export type Cell = [number, number];

function key(x: number, y: number): string {
  return `${x},${y}`;
}

export function nextGeneration(cells: Cell[]): Cell[] {
  const live = new Set<string>();
  for (const [x, y] of cells) {
    live.add(key(x, y));
  }

  // Count live neighbors for each cell that could be alive next generation
  // (i.e. any cell adjacent to a currently-live cell, plus the live cells themselves)
  const neighborCounts = new Map<string, number>();

  for (const [x, y] of cells) {
    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        if (dx === 0 && dy === 0) continue;
        const nx = x + dx;
        const ny = y + dy;
        const k = key(nx, ny);
        neighborCounts.set(k, (neighborCounts.get(k) ?? 0) + 1);
      }
    }
  }

  const result: Cell[] = [];
  const seen = new Set<string>();

  for (const [k, count] of neighborCounts) {
    const isAlive = live.has(k);
    if (count === 3 || (count === 2 && isAlive)) {
      const [xs, ys] = k.split(",");
      result.push([Number(xs), Number(ys)]);
      seen.add(k);
    }
  }

  // Live cells with zero live neighbors won't appear in neighborCounts;
  // they have 0 neighbors so they die — nothing to add.

  return result;
}
