export type Cell = [number, number];

const cellKey = ([x, y]: Cell): string => `${x},${y}`;
const parseKey = (key: string): Cell => {
  const [x, y] = key.split(',');
  return [Number(x), Number(y)];
};

export function nextGeneration(cells: Cell[]): Cell[] {
  const liveCells = new Set(cells.map(cellKey));
  const neighborCounts = new Map<string, number>();

  for (const [x, y] of cells) {
    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        if (dx === 0 && dy === 0) continue;
        const key = cellKey([x + dx, y + dy]);
        neighborCounts.set(key, (neighborCounts.get(key) ?? 0) + 1);
      }
    }
  }

  const survives = (key: string, count: number): boolean =>
    count === 3 || (count === 2 && liveCells.has(key));

  const nextLiveKeys: string[] = [];
  for (const [key, count] of neighborCounts) {
    if (survives(key, count)) nextLiveKeys.push(key);
  }

  return nextLiveKeys.map(parseKey);
}
