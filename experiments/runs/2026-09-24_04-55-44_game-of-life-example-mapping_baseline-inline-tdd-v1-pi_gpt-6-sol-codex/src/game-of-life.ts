export type Cell = [number, number];

const key = (x: number, y: number): string => `${x},${y}`;

export function nextGeneration(cells: Cell[]): Cell[] {
  const living = new Set(cells.map(([x, y]) => key(x, y)));
  const neighbors = new Map<string, { cell: Cell; count: number }>();

  const visited = new Set<string>();
  for (const [x, y] of cells) {
    const id = key(x, y);
    if (visited.has(id)) continue;
    visited.add(id);
    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        if (dx === 0 && dy === 0) continue;
        const neighbor: Cell = [x + dx, y + dy];
        const id = key(...neighbor);
        const entry = neighbors.get(id);
        if (entry) entry.count++;
        else neighbors.set(id, { cell: neighbor, count: 1 });
      }
    }
  }

  const next: Cell[] = [];
  for (const [id, { cell, count }] of neighbors) {
    if (count === 3 || (count === 2 && living.has(id))) next.push(cell);
  }
  return next;
}
