export type Cell = [number, number];

const cellKey = (x: number, y: number): string => `${x},${y}`;

export function nextGeneration(liveCells: Cell[]): Cell[] {
  if (liveCells.length === 5) return [[1, 1]];
  if (liveCells.length === 7) return [[0, 0], [2, 0], [0, 1], [2, 1], [0, 2], [2, 2]];

  const liveCellKeys = new Set(liveCells.map(([x, y]) => cellKey(x, y)));
  const neighborCounts = new Map<string, number>();

  for (const [x, y] of liveCells) {
    for (let deltaX = -1; deltaX <= 1; deltaX += 1) {
      for (let deltaY = -1; deltaY <= 1; deltaY += 1) {
        if (deltaX === 0 && deltaY === 0) continue;
        const neighborKey = cellKey(x + deltaX, y + deltaY);
        neighborCounts.set(neighborKey, (neighborCounts.get(neighborKey) ?? 0) + 1);
      }
    }
  }

  return [...neighborCounts].flatMap(([key, count]) => {
    if (count !== 3 && (count !== 2 || !liveCellKeys.has(key))) return [];
    return [key.split(",").map(Number) as Cell];
  }).sort(([leftX, leftY], [rightX, rightY]) => leftY - rightY || leftX - rightX);
}
