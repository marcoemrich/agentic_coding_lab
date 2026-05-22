export type Cell = [number, number];

const key = ([x, y]: Cell) => `${x},${y}`;

export function nextGeneration(cells: Cell[]): Cell[] {
  const alive = new Set(cells.map(key));
  const neighborCounts = new Map<string, { cell: Cell; count: number }>();

  for (const [x, y] of cells) {
    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        if (dx === 0 && dy === 0) continue;
        const neighbor: Cell = [x + dx, y + dy];
        const k = key(neighbor);
        const entry = neighborCounts.get(k);
        if (entry) entry.count++;
        else neighborCounts.set(k, { cell: neighbor, count: 1 });
      }
    }
  }

  const next: Cell[] = [];
  for (const [k, { cell, count }] of neighborCounts) {
    if (count === 3 || (count === 2 && alive.has(k))) next.push(cell);
  }
  return next;
}
