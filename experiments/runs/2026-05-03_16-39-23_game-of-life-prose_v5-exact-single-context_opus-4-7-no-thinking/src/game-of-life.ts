export type Cell = [number, number];

const keyOf = (x: number, y: number): string => `${x},${y}`;
const parseKey = (key: string): Cell => {
  const [x, y] = key.split(",").map(Number);
  return [x, y];
};

const neighborOffsets: Array<[number, number]> = [
  [-1, -1], [-1, 0], [-1, 1],
  [0, -1],           [0, 1],
  [1, -1],  [1, 0],  [1, 1],
];

const survivesOrIsBorn = (isLive: boolean, liveNeighbors: number): boolean =>
  isLive ? liveNeighbors === 2 || liveNeighbors === 3 : liveNeighbors === 3;

export const nextGeneration = (cells: Cell[]): Cell[] => {
  const liveKeys = new Set(cells.map(([x, y]) => keyOf(x, y)));
  const neighborCounts = new Map<string, number>();

  for (const [x, y] of cells) {
    for (const [dx, dy] of neighborOffsets) {
      const key = keyOf(x + dx, y + dy);
      neighborCounts.set(key, (neighborCounts.get(key) ?? 0) + 1);
    }
  }

  const result: Cell[] = [];
  for (const [key, count] of neighborCounts) {
    if (survivesOrIsBorn(liveKeys.has(key), count)) {
      result.push(parseKey(key));
    }
  }
  return result;
};
