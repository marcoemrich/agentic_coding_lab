export type Cell = [number, number];

const key = (x: number, y: number): string => `${x},${y}`;
const parseKey = (k: string): Cell => {
  const [x, y] = k.split(",");
  return [Number(x), Number(y)];
};

export function nextGeneration(cells: Cell[]): Cell[] {
  const alive = new Set(cells.map(([x, y]) => key(x, y)));
  const neighborCounts = new Map<string, number>();

  for (const [x, y] of cells) {
    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        if (dx === 0 && dy === 0) continue;
        const k = key(x + dx, y + dy);
        neighborCounts.set(k, (neighborCounts.get(k) ?? 0) + 1);
      }
    }
  }

  const nextCells: Cell[] = [];
  for (const [k, count] of neighborCounts) {
    const survives = alive.has(k) && (count === 2 || count === 3);
    const reproduces = !alive.has(k) && count === 3;
    if (survives || reproduces) nextCells.push(parseKey(k));
  }
  return nextCells;
}
