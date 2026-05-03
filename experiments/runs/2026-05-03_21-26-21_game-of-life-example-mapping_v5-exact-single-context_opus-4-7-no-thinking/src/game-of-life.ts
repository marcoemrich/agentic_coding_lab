export type Cell = [number, number];

const cellKey = ([x, y]: Cell): string => `${x},${y}`;

export const nextGeneration = (cells: Cell[]): Cell[] => {
  const alive = new Set(cells.map(cellKey));
  const candidates = new Map<string, { cell: Cell; neighbors: number }>();

  for (const [x, y] of cells) {
    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        if (dx === 0 && dy === 0) continue;
        const cell: Cell = [x + dx, y + dy];
        const k = cellKey(cell);
        const existing = candidates.get(k);
        if (existing) existing.neighbors++;
        else candidates.set(k, { cell, neighbors: 1 });
      }
    }
  }

  const result: Cell[] = [];
  for (const [k, { cell, neighbors }] of candidates) {
    const survives = alive.has(k) && neighbors === 2;
    if (survives || neighbors === 3) result.push(cell);
  }

  return result;
};
