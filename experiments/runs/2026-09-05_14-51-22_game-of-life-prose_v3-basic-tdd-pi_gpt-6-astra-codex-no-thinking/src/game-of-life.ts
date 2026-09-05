export type Cell = [number, number];

function key(x: number, y: number): string {
  return `${x},${y}`;
}

export function nextGeneration(cells: Cell[]): Cell[] {
  const living = new Map(cells.map(cell => [key(...cell), cell]));
  const neighbors = new Map<string, { cell: Cell; count: number }>();

  // Only the eight neighbors of living cells can survive or be born.
  for (const [x, y] of living.values()) {
    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        if (dx === 0 && dy === 0) continue;
        const cell: Cell = [x + dx, y + dy];
        const id = key(...cell);
        const entry = neighbors.get(id);
        if (entry) entry.count++;
        else neighbors.set(id, { cell, count: 1 });
      }
    }
  }

  const next: Cell[] = [];
  for (const [id, { cell, count }] of neighbors) {
    if (count === 3 || (count === 2 && living.has(id))) {
      next.push(cell);
    }
  }
  return next;
}
