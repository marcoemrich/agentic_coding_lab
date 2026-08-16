export type Cell = [number, number];

const coordinateKey = (x: number, y: number): string => `${x},${y}`;

export function nextGeneration(currentLiveCells: Cell[]): Cell[] {
  const liveCellKeys = new Set(currentLiveCells.map(([x, y]) => coordinateKey(x, y)));
  const neighborCounts = new Map<string, number>();

  for (const [x, y] of currentLiveCells) {
    for (let deltaX = -1; deltaX <= 1; deltaX += 1) {
      for (let deltaY = -1; deltaY <= 1; deltaY += 1) {
        if (deltaX === 0 && deltaY === 0) continue;
        const neighborKey = coordinateKey(x + deltaX, y + deltaY);
        neighborCounts.set(neighborKey, (neighborCounts.get(neighborKey) ?? 0) + 1);
      }
    }
  }

  const nextLiveCells: Cell[] = [];
  for (const [coordinate, count] of neighborCounts) {
    if (count === 3 || (count === 2 && liveCellKeys.has(coordinate))) {
      const [x, y] = coordinate.split(",").map(Number);
      nextLiveCells.push([x, y]);
    }
  }

  return nextLiveCells.sort(([x1, y1], [x2, y2]) => x1 - x2 || y1 - y2);
}
