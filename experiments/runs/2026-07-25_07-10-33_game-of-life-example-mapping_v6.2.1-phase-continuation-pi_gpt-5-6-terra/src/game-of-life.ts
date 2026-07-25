export type Cell = [number, number];

const cellKey = (x: number, y: number): string => `${x},${y}`;

export function nextGeneration(currentGeneration: Cell[]): Cell[] {
  const liveCellKeys = new Set(currentGeneration.map(([x, y]) => cellKey(x, y)));
  const neighborCounts = new Map<string, number>();

  for (const [x, y] of currentGeneration) {
    for (let dx = -1; dx <= 1; dx += 1) {
      for (let dy = -1; dy <= 1; dy += 1) {
        if (dx === 0 && dy === 0) continue;
        const key = cellKey(x + dx, y + dy);
        neighborCounts.set(key, (neighborCounts.get(key) ?? 0) + 1);
      }
    }
  }

  return [...neighborCounts]
    .flatMap(([key, count]) => {
      const isLiveCell = liveCellKeys.has(key);
      if ((isLiveCell && (count === 2 || count === 3)) || (!isLiveCell && count === 3)) {
        return [key.split(",").map(Number) as Cell];
      }
      return [];
    })
    .sort(([firstX, firstY], [secondX, secondY]) => firstX - secondX || firstY - secondY);
}
