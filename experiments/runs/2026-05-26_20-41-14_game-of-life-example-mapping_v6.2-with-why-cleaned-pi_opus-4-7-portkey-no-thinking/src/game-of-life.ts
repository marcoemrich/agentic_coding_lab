export type Cell = [number, number];

const cellKey = (x: number, y: number): string => `${x},${y}`;
const parseCellKey = (key: string): Cell => {
  const [xs, ys] = key.split(",");
  return [Number(xs), Number(ys)];
};

const NEIGHBOR_OFFSETS: ReadonlyArray<Cell> = [
  [-1, -1], [0, -1], [1, -1],
  [-1,  0],          [1,  0],
  [-1,  1], [0,  1], [1,  1],
];

export function nextGeneration(liveCells: Cell[]): Cell[] {
  const liveSet = new Set(liveCells.map(([x, y]) => cellKey(x, y)));
  const neighborCounts = new Map<string, number>();

  for (const [x, y] of liveCells) {
    for (const [dx, dy] of NEIGHBOR_OFFSETS) {
      const key = cellKey(x + dx, y + dy);
      neighborCounts.set(key, (neighborCounts.get(key) ?? 0) + 1);
    }
  }

  const result: Cell[] = [];
  for (const [key, count] of neighborCounts) {
    const isAlive = liveSet.has(key);
    const survives = isAlive && (count === 2 || count === 3);
    const born = !isAlive && count === 3;
    if (survives || born) {
      result.push(parseCellKey(key));
    }
  }
  return result;
}
