type Cell = [number, number]; // [x, y]

const toKey = ([x, y]: Cell): string => `${x},${y}`;
const fromKey = (key: string): Cell => key.split(",").map(Number) as Cell;

export function nextGeneration(cells: Cell[]): Cell[] {
  const alive = new Set(cells.map(toKey));
  const neighborCounts = new Map<string, number>();

  for (const [x, y] of cells) {
    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        if (dx === 0 && dy === 0) continue;
        const key = toKey([x + dx, y + dy]);
        neighborCounts.set(key, (neighborCounts.get(key) ?? 0) + 1);
      }
    }
  }

  const result: Cell[] = [];
  for (const [key, count] of neighborCounts) {
    if (count === 3 || (count === 2 && alive.has(key))) {
      result.push(fromKey(key));
    }
  }
  return result;
}
