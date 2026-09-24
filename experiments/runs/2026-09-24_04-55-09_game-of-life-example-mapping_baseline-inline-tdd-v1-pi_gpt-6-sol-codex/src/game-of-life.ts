export type Cell = [number, number];

export function nextGeneration(cells: Cell[]): Cell[] {
  const living = new Map(cells.map((cell) => [`${cell[0]},${cell[1]}`, cell]));
  const neighbors = new Map<string, { cell: Cell; count: number }>();

  for (const [x, y] of living.values()) {
    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        if (dx === 0 && dy === 0) continue;
        const cell: Cell = [x + dx, y + dy];
        const key = `${cell[0]},${cell[1]}`;
        const entry = neighbors.get(key);
        if (entry) entry.count++;
        else neighbors.set(key, { cell, count: 1 });
      }
    }
  }

  return [...neighbors.entries()]
    .filter(([key, { count }]) => count === 3 || (count === 2 && living.has(key)))
    .map(([, { cell }]) => cell);
}
