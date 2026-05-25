type Cell = [number, number];

const encode = ([x, y]: Cell): string => `${x},${y}`;
const decode = (key: string): Cell => {
  const [x, y] = key.split(',');
  return [Number(x), Number(y)];
};

export function nextGeneration(cells: Cell[]): Cell[] {
  const liveSet = new Set<string>(cells.map(encode));
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

  const survives = (key: string, count: number): boolean =>
    count === 3 || (count === 2 && liveSet.has(key));

  const result: Cell[] = [];
  for (const [key, count] of neighborCounts) {
    if (survives(key, count)) result.push(decode(key));
  }
  return result;
}
