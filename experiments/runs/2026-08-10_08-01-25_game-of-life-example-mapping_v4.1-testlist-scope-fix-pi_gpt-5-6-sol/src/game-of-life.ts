export type Cell = [number, number];

export function nextGeneration(currentLiveCells: readonly Cell[]): Cell[] {
  const liveCells = new Set(currentLiveCells.map(([x, y]) => `${x},${y}`));
  const neighborCounts = new Map<string, number>();

  for (const [x, y] of currentLiveCells) {
    for (let xOffset = -1; xOffset <= 1; xOffset += 1) {
      for (let yOffset = -1; yOffset <= 1; yOffset += 1) {
        if (xOffset === 0 && yOffset === 0) continue;
        const neighborKey = `${x + xOffset},${y + yOffset}`;
        neighborCounts.set(neighborKey, (neighborCounts.get(neighborKey) ?? 0) + 1);
      }
    }
  }

  return [...neighborCounts]
    .filter(([cell, count]) => count === 3 || (count === 2 && liveCells.has(cell)))
    .map(([cell]) => cell.split(",").map(Number) as Cell)
    .sort(([xA, yA], [xB, yB]) => yA - yB || xA - xB);
}

export function advanceGenerations(currentLiveCells: readonly Cell[], generations: number): Cell[] {
  return Array.from({ length: generations }).reduce<Cell[]>(
    (liveCells) => nextGeneration(liveCells),
    [...currentLiveCells],
  );
}
