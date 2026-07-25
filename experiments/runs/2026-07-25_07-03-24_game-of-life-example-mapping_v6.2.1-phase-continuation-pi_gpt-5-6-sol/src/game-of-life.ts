export type Cell = [x: number, y: number];

export function nextGeneration(livingCells: Cell[]): Cell[] {
  const neighborCounts = new Map<string, number>();

  for (const [x, y] of livingCells) {
    for (let dx = -1; dx <= 1; dx += 1) {
      for (let dy = -1; dy <= 1; dy += 1) {
        if (dx === 0 && dy === 0) continue;
        const key = `${x + dx},${y + dy}`;
        neighborCounts.set(key, (neighborCounts.get(key) ?? 0) + 1);
      }
    }
  }

  const livingKeys = new Set(livingCells.map(([x, y]) => `${x},${y}`));
  const nextLivingCells: Cell[] = [];
  for (const [key, count] of neighborCounts) {
    if (count === 3 || (count === 2 && livingKeys.has(key))) {
      const [x, y] = key.split(",").map(Number);
      nextLivingCells.push([x, y]);
    }
  }
  return nextLivingCells;
}
