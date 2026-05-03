export type Cell = [number, number];

const cellKey = (x: number, y: number): string => `${x},${y}`;

export const nextGeneration = (cells: Cell[]): Cell[] => {
  const alive = new Set(cells.map(([x, y]) => cellKey(x, y)));
  const neighborCounts = new Map<string, { cell: Cell; count: number }>();

  for (const [x, y] of cells) {
    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        if (dx === 0 && dy === 0) continue;
        const nx = x + dx;
        const ny = y + dy;
        const k = cellKey(nx, ny);
        const entry = neighborCounts.get(k);
        if (entry) {
          entry.count += 1;
        } else {
          neighborCounts.set(k, { cell: [nx, ny], count: 1 });
        }
      }
    }
  }

  const result: Cell[] = [];
  for (const [k, { cell, count }] of neighborCounts) {
    if (count === 3 || (count === 2 && alive.has(k))) {
      result.push(cell);
    }
  }
  return result;
};
