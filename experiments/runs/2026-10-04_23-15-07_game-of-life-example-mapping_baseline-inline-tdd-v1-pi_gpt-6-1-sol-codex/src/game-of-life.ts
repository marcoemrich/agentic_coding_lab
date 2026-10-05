export type Cell = [number, number];

const SURVIVAL_MIN = 2;
const REPRODUCTION_COUNT = 3;

function key([x, y]: Cell): string {
  return `${x},${y}`;
}

function neighbors([x, y]: Cell): Cell[] {
  const result: Cell[] = [];
  for (let dx = -1; dx <= 1; dx++) {
    for (let dy = -1; dy <= 1; dy++) {
      if (dx !== 0 || dy !== 0) result.push([x + dx, y + dy]);
    }
  }
  return result;
}

export function nextGeneration(cells: Cell[]): Cell[] {
  const living = new Map(cells.map(cell => [key(cell), cell]));
  const counts = new Map<string, { cell: Cell; count: number }>();
  for (const cell of living.values()) {
    for (const neighbor of neighbors(cell)) {
      const id = key(neighbor);
      const entry = counts.get(id) ?? { cell: neighbor, count: 0 };
      entry.count++;
      counts.set(id, entry);
    }
  }

  const next: Cell[] = [];
  for (const [id, { cell, count }] of counts) {
    if (count === REPRODUCTION_COUNT || (count === SURVIVAL_MIN && living.has(id))) {
      next.push(cell);
    }
  }
  return next;
}
