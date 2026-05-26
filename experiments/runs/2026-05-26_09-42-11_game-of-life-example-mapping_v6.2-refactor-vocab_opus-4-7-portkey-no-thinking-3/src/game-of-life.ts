export type Cell = [x: number, y: number];

const NEIGHBOR_OFFSETS: ReadonlyArray<Cell> = [
  [-1, -1], [0, -1], [1, -1],
  [-1,  0],          [1,  0],
  [-1,  1], [0,  1], [1,  1],
];

const cellKey = ([x, y]: Cell): string => `${x},${y}`;

const survives = (neighborCount: number, wasAlive: boolean): boolean =>
  neighborCount === 3 || (neighborCount === 2 && wasAlive);

const neighborsOf = ([x, y]: Cell): Cell[] =>
  NEIGHBOR_OFFSETS.map(([dx, dy]) => [x + dx, y + dy]);

type NeighborTally = { cell: Cell; count: number };

const tallyNeighbors = (livingCells: Cell[]): Map<string, NeighborTally> => {
  const tallies = new Map<string, NeighborTally>();
  for (const livingCell of livingCells) {
    for (const neighbor of neighborsOf(livingCell)) {
      const key = cellKey(neighbor);
      const tally = tallies.get(key) ?? { cell: neighbor, count: 0 };
      tally.count += 1;
      tallies.set(key, tally);
    }
  }
  return tallies;
};

export function nextGeneration(livingCells: Cell[]): Cell[] {
  const wasAlive = new Set(livingCells.map(cellKey));
  return Array.from(tallyNeighbors(livingCells).entries())
    .filter(([key, { count }]) => survives(count, wasAlive.has(key)))
    .map(([, { cell }]) => cell);
}
