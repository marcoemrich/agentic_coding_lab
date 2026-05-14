export type Cell = [number, number];

const key = (x: number, y: number): string => `${x},${y}`;

export function nextGeneration(cells: Cell[]): Cell[] {
  const alive = new Set<string>();
  for (const [x, y] of cells) {
    alive.add(key(x, y));
  }

  // Count neighbors for every cell adjacent to a live cell
  const neighborCounts = new Map<string, number>();
  const coords = new Map<string, Cell>();

  for (const [x, y] of cells) {
    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        if (dx === 0 && dy === 0) continue;
        const nx = x + dx;
        const ny = y + dy;
        const k = key(nx, ny);
        neighborCounts.set(k, (neighborCounts.get(k) ?? 0) + 1);
        if (!coords.has(k)) coords.set(k, [nx, ny]);
      }
    }
  }

  const next: Cell[] = [];
  for (const [k, count] of neighborCounts) {
    const cell = coords.get(k)!;
    if (alive.has(k)) {
      // Live cell: survives with 2 or 3 neighbors
      if (count === 2 || count === 3) next.push(cell);
    } else {
      // Dead cell: becomes alive with exactly 3 neighbors
      if (count === 3) next.push(cell);
    }
  }

  return next;
}
