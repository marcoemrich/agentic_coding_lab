export type Cell = [number, number]; // [x, y]

const NEIGHBOR_OFFSETS: Cell[] = [
  [-1, -1], [0, -1], [1, -1],
  [-1, 0],            [1, 0],
  [-1, 1],  [0, 1],   [1, 1],
];

const keyOf = ([x, y]: Cell): string => `${x},${y}`;

const cellFromKey = (key: string): Cell => key.split(",").map(Number) as Cell;

const livesOnNextGeneration = (
  neighborCount: number,
  currentlyAlive: boolean,
): boolean => neighborCount === 3 || (neighborCount === 2 && currentlyAlive);

export function nextGeneration(liveCells: Cell[]): Cell[] {
  const liveKeys = new Set(liveCells.map(keyOf));
  const neighborCounts = new Map<string, number>();
  for (const [x, y] of liveCells) {
    for (const [dx, dy] of NEIGHBOR_OFFSETS) {
      const key = keyOf([x + dx, y + dy]);
      neighborCounts.set(key, (neighborCounts.get(key) ?? 0) + 1);
    }
  }
  const nextLiveCells: Cell[] = [];
  for (const [key, count] of neighborCounts) {
    if (livesOnNextGeneration(count, liveKeys.has(key))) {
      nextLiveCells.push(cellFromKey(key));
    }
  }
  return nextLiveCells;
}
