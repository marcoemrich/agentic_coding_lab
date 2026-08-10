export type Cell = readonly [number, number];

export function nextGeneration(cells: Cell[]): Cell[] {
  const liveCells = new Set(cells.map(([x, y]) => `${x},${y}`));
  const neighborCounts = new Map<string, number>();

  for (const [x, y] of cells) {
    for (let deltaX = -1; deltaX <= 1; deltaX += 1) {
      for (let deltaY = -1; deltaY <= 1; deltaY += 1) {
        if (deltaX === 0 && deltaY === 0) continue;
        const key = `${x + deltaX},${y + deltaY}`;
        neighborCounts.set(key, (neighborCounts.get(key) ?? 0) + 1);
      }
    }
  }

  const nextGenerationCells: Cell[] = [];
  for (const [key, count] of neighborCounts) {
    if (count === 3 || (count === 2 && liveCells.has(key))) {
      const [x, y] = key.split(",").map(Number);
      nextGenerationCells.push([x, y]);
    }
  }
  return nextGenerationCells;
}
