const cellKey = (x: number, y: number): string => `${x},${y}`;

const parseKey = (key: string): number[] => key.split(",").map(Number);

const NEIGHBOR_OFFSETS: number[][] = [
  [-1, -1], [0, -1], [1, -1],
  [-1,  0],          [1,  0],
  [-1,  1], [0,  1], [1,  1],
];

const neighborKeys = (x: number, y: number): string[] =>
  NEIGHBOR_OFFSETS.map(([dx, dy]) => cellKey(x + dx, y + dy));

export const nextGeneration = (liveCells: number[][]): number[][] => {
  const liveSet = new Set(liveCells.map(([x, y]) => cellKey(x, y)));

  const neighborCounts = new Map<string, number>();

  for (const [x, y] of liveCells) {
    for (const key of neighborKeys(x, y)) {
      neighborCounts.set(key, (neighborCounts.get(key) ?? 0) + 1);
    }
  }

  const willBeAlive = (key: string, count: number): boolean =>
    count === 3 || (count === 2 && liveSet.has(key));

  const nextLiveCells: number[][] = [];

  for (const [key, count] of neighborCounts) {
    if (willBeAlive(key, count)) {
      nextLiveCells.push(parseKey(key));
    }
  }

  return nextLiveCells;
};
