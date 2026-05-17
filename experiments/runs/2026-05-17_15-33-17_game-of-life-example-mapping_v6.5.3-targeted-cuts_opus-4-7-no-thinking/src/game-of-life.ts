export type Cell = [x: number, y: number];

const NEIGHBOR_OFFSETS: ReadonlyArray<Cell> = [
  [-1, -1], [-1, 0], [-1, 1],
  [0, -1],           [0, 1],
  [1, -1],  [1, 0],  [1, 1],
];

const keyOf = ([x, y]: Cell): string => `${x},${y}`;

type NeighborTally = { cell: Cell; count: number };

const tallyLiveNeighbors = (liveCells: Cell[]): Map<string, NeighborTally> => {
  const tallies = new Map<string, NeighborTally>();
  for (const [x, y] of liveCells) {
    for (const [dx, dy] of NEIGHBOR_OFFSETS) {
      const neighbor: Cell = [x + dx, y + dy];
      const key = keyOf(neighbor);
      const existing = tallies.get(key);
      if (existing) existing.count++;
      else tallies.set(key, { cell: neighbor, count: 1 });
    }
  }
  return tallies;
};

export function nextGeneration(liveCells: Cell[]): Cell[] {
  const liveKeys = new Set(liveCells.map(keyOf));
  const tallies = tallyLiveNeighbors(liveCells);
  const nextGen: Cell[] = [];
  for (const [key, { cell, count }] of tallies) {
    if (count === 3 || (count === 2 && liveKeys.has(key))) nextGen.push(cell);
  }
  return nextGen;
}
