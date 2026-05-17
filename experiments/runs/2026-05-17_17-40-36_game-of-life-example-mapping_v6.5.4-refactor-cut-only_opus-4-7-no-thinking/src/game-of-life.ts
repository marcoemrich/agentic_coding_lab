export type Cell = [number, number];

const NEIGHBOR_OFFSETS: ReadonlyArray<[number, number]> = [
  [-1, -1], [-1, 0], [-1, 1],
  [0, -1],           [0, 1],
  [1, -1],  [1, 0],  [1, 1],
];

const keyOf = ([x, y]: Cell): string => `${x},${y}`;

const neighborsOf = ([x, y]: Cell): Cell[] =>
  NEIGHBOR_OFFSETS.map(([dx, dy]) => [x + dx, y + dy]);

const countLiveNeighbors = (cell: Cell, liveSet: ReadonlySet<string>): number =>
  neighborsOf(cell).filter((neighbor) => liveSet.has(keyOf(neighbor))).length;

const willBeAlive = (cell: Cell, liveSet: ReadonlySet<string>): boolean => {
  const count = countLiveNeighbors(cell, liveSet);
  return count === 3 || (count === 2 && liveSet.has(keyOf(cell)));
};

export function nextGeneration(liveCells: Cell[]): Cell[] {
  const liveSet = new Set(liveCells.map(keyOf));
  const candidates = liveCells.flatMap((cell) => [cell, ...neighborsOf(cell)]);
  const uniqueCandidates = new Map(candidates.map((cell) => [keyOf(cell), cell]));

  return [...uniqueCandidates.values()].filter((cell) => willBeAlive(cell, liveSet));
}
