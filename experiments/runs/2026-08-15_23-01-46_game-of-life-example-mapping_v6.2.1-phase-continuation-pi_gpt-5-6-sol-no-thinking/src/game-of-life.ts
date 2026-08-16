export type Cell = [x: number, y: number];

export function nextGeneration(currentLiveCells: Cell[]): Cell[] {
  const liveCellKeys = new Set(currentLiveCells.map(([x, y]) => `${x},${y}`));
  const neighborCounts = new Map<string, number>();

  for (const [x, y] of currentLiveCells) {
    for (let offsetY = -1; offsetY <= 1; offsetY += 1) {
      for (let offsetX = -1; offsetX <= 1; offsetX += 1) {
        if (offsetX === 0 && offsetY === 0) continue;
        const key = `${x + offsetX},${y + offsetY}`;
        neighborCounts.set(key, (neighborCounts.get(key) ?? 0) + 1);
      }
    }
  }

  const nextLiveCells: Cell[] = [];
  for (const [cellKey, liveNeighborCount] of neighborCounts) {
    if (liveNeighborCount === 3 || (liveNeighborCount === 2 && liveCellKeys.has(cellKey))) {
      const [x, y] = cellKey.split(",").map(Number);
      nextLiveCells.push([x, y]);
    }
  }
  return nextLiveCells.sort(([xA, yA], [xB, yB]) => yA - yB || xA - xB);
}
