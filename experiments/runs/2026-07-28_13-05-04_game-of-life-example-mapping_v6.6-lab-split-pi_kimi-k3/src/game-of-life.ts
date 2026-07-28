export type Cell = [number, number];

const cellKey = (x: number, y: number): string => `${x},${y}`;

const neighborOffsets: Cell[] = [
  [-1, -1], [0, -1], [1, -1],
  [-1, 0], [1, 0],
  [-1, 1], [0, 1], [1, 1],
];

const BIRTH_NEIGHBOR_COUNT = 3;
const SURVIVAL_NEIGHBOR_COUNT = 2;

const livesInNextGeneration = (neighborCount: number, isAlive: boolean): boolean =>
  neighborCount === BIRTH_NEIGHBOR_COUNT || (isAlive && neighborCount === SURVIVAL_NEIGHBOR_COUNT);

const countNeighbors = (liveCells: Cell[]): Map<string, number> => {
  const neighborCounts = new Map<string, number>();
  for (const [x, y] of liveCells) {
    for (const [dx, dy] of neighborOffsets) {
      const k = cellKey(x + dx, y + dy);
      neighborCounts.set(k, (neighborCounts.get(k) ?? 0) + 1);
    }
  }
  return neighborCounts;
};

export function nextGeneration(liveCells: Cell[]): Cell[] {
  const liveCellKeys = new Set(liveCells.map(([x, y]) => cellKey(x, y)));
  const neighborCounts = countNeighbors(liveCells);

  const nextLiveCells: Cell[] = [];
  for (const [k, count] of neighborCounts) {
    if (livesInNextGeneration(count, liveCellKeys.has(k))) {
      nextLiveCells.push(k.split(",").map(Number) as Cell);
    }
  }
  return nextLiveCells;
}
