export type Cell = [number, number];

const key = (x: number, y: number): string => `${x},${y}`;

export function nextGeneration(cells: Cell[]): Cell[] {
  const alive = new Set<string>(cells.map(([x, y]) => key(x, y)));
  const neighborCounts = new Map<string, { cell: Cell; count: number }>();

  for (const [x, y] of cells) {
    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        if (dx === 0 && dy === 0) continue;
        const nx = x + dx;
        const ny = y + dy;
        const k = key(nx, ny);
        const entry = neighborCounts.get(k);
        if (entry) {
          entry.count++;
        } else {
          neighborCounts.set(k, { cell: [nx, ny], count: 1 });
        }
      }
    }
  }

  const result: Cell[] = [];
  for (const [k, { cell, count }] of neighborCounts) {
    if (alive.has(k)) {
      if (count === 2 || count === 3) result.push(cell);
    } else if (count === 3) {
      result.push(cell);
    }
  }

  return result;
}
