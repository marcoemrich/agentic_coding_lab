export type Cell = [number, number];

export function nextGeneration(cells: Cell[]): Cell[] {
  const key = (x: number, y: number): string => `${x},${y}`;
  const live = new Map<string, Cell>(cells.map(([x, y]) => [key(x, y), [x, y]]));
  const neighborCounts = new Map<string, { cell: Cell; count: number }>();

  for (const [x, y] of live.values()) {
    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        if (dx === 0 && dy === 0) continue;
        const neighbor: Cell = [x + dx, y + dy];
        const id = key(...neighbor);
        const entry = neighborCounts.get(id);
        if (entry) entry.count++;
        else neighborCounts.set(id, { cell: neighbor, count: 1 });
      }
    }
  }

  const next: Cell[] = [];
  for (const [id, { cell, count }] of neighborCounts) {
    if (count === 3 || (count === 2 && live.has(id))) next.push(cell);
  }
  return next;
}
