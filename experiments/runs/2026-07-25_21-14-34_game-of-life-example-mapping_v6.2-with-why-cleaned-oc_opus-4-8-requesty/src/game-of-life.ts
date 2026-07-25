type Cell = [number, number];

const encode = ([x, y]: Cell): string => `${x},${y}`;
const decode = (key: string): Cell => {
  const [x, y] = key.split(",").map(Number);
  return [x, y];
};

export function nextGeneration(cells: Cell[]): Cell[] {
  const liveKeys = new Set(cells.map(encode));
  const neighborCounts = new Map<string, number>();

  for (const [x, y] of cells) {
    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        if (dx === 0 && dy === 0) continue;
        const key = encode([x + dx, y + dy]);
        neighborCounts.set(key, (neighborCounts.get(key) ?? 0) + 1);
      }
    }
  }

  const nextLiveCells: Cell[] = [];
  for (const [key, count] of neighborCounts) {
    const isAlive = liveKeys.has(key);
    if (count === 3 || (isAlive && count === 2)) {
      nextLiveCells.push(decode(key));
    }
  }

  return nextLiveCells;
}
