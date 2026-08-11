export type Cell = [x: number, y: number];

const NEIGHBOR_OFFSETS: Cell[] = [
  [-1, -1], [-1, 0], [-1, 1],
  [0, -1],           [0, 1],
  [1, -1],  [1, 0],  [1, 1],
];

const NEIGHBORS_TO_SURVIVE = 2;
const NEIGHBORS_TO_REPRODUCE = 3;

const toKey = ([x, y]: Cell): string => `${x},${y}`;

type NeighborTally = { cell: Cell; key: string; liveNeighborCount: number };

function tallyLiveNeighborsForEachCandidate(liveCells: Cell[]): NeighborTally[] {
  const tallies = new Map<string, NeighborTally>();
  for (const [x, y] of liveCells) {
    for (const [dx, dy] of NEIGHBOR_OFFSETS) {
      const cell: Cell = [x + dx, y + dy];
      const key = toKey(cell);
      const tally = tallies.get(key) ?? { cell, key, liveNeighborCount: 0 };
      tally.liveNeighborCount += 1;
      tallies.set(key, tally);
    }
  }
  return [...tallies.values()];
}

export function nextGeneration(liveCells: Cell[]): Cell[] {
  const aliveKeys = new Set(liveCells.map(toKey));
  const survives = ({ key, liveNeighborCount }: NeighborTally): boolean =>
    liveNeighborCount === NEIGHBORS_TO_REPRODUCE ||
    (liveNeighborCount === NEIGHBORS_TO_SURVIVE && aliveKeys.has(key));
  return tallyLiveNeighborsForEachCandidate(liveCells)
    .filter(survives)
    .map(({ cell }) => cell);
}
