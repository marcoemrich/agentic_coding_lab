type Cell = [number, number];

const cellKey = ([x, y]: Cell): string => `${x},${y}`;

export function nextGeneration(grid: Cell[]): Cell[] {
  const liveCellKeys = new Set(grid.map(cellKey));
  const neighborCountByCell = new Map<string, { cell: Cell; count: number }>();

  for (const [x, y] of grid) {
    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        if (dx === 0 && dy === 0) continue;
        const neighbor: Cell = [x + dx, y + dy];
        const k = cellKey(neighbor);
        const existing = neighborCountByCell.get(k);
        neighborCountByCell.set(k, { cell: neighbor, count: (existing?.count ?? 0) + 1 });
      }
    }
  }

  const nextLiveCells: Cell[] = [];
  for (const [k, { cell, count }] of neighborCountByCell) {
    const survives = liveCellKeys.has(k) && count === 2;
    const reproduces = count === 3;
    if (survives || reproduces) {
      nextLiveCells.push(cell);
    }
  }
  return nextLiveCells;
}
