type Cell = [number, number]; // [x, y]

const NEIGHBOR_OFFSETS: Cell[] = [];
for (let dx = -1; dx <= 1; dx++) {
  for (let dy = -1; dy <= 1; dy++) {
    if (dx !== 0 || dy !== 0) {
      NEIGHBOR_OFFSETS.push([dx, dy]);
    }
  }
}

export function nextGeneration(cells: Cell[]): Cell[] {
  const liveCells = new Set(cells.map(([x, y]) => `${x},${y}`));
  const neighborCounts = new Map<string, number>();

  for (const [x, y] of cells) {
    for (const [dx, dy] of NEIGHBOR_OFFSETS) {
      const key = `${x + dx},${y + dy}`;
      neighborCounts.set(key, (neighborCounts.get(key) ?? 0) + 1);
    }
  }

  const candidates = new Set([...liveCells, ...neighborCounts.keys()]);
  const nextCells: Cell[] = [];

  for (const key of candidates) {
    const neighborCount = neighborCounts.get(key) ?? 0;
    const survives = neighborCount === 3 || (liveCells.has(key) && neighborCount === 2);
    if (survives) {
      const [x, y] = key.split(",").map(Number);
      nextCells.push([x, y]);
    }
  }

  return nextCells.sort(([ax, ay], [bx, by]) => ay - by || ax - bx);
}