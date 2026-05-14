export type Cell = [number, number];

const key = (x: number, y: number): string => `${x},${y}`;

const NEIGHBOR_OFFSETS: ReadonlyArray<[number, number]> = [
  [-1, -1], [-1, 0], [-1, 1],
  [0, -1],           [0, 1],
  [1, -1],  [1, 0],  [1, 1],
];

const countLiveNeighbors = (x: number, y: number, liveSet: Set<string>): number => {
  let count = 0;
  for (const [dx, dy] of NEIGHBOR_OFFSETS) {
    if (liveSet.has(key(x + dx, y + dy))) count++;
  }
  return count;
};

const survives = (isLive: boolean, neighbors: number): boolean =>
  (isLive && (neighbors === 2 || neighbors === 3)) || (!isLive && neighbors === 3);

const addCandidate = (candidates: Map<string, Cell>, x: number, y: number): void => {
  candidates.set(key(x, y), [x, y]);
};

const collectCandidates = (cells: Cell[]): Map<string, Cell> => {
  const candidates = new Map<string, Cell>();
  for (const [x, y] of cells) {
    addCandidate(candidates, x, y);
    for (const [dx, dy] of NEIGHBOR_OFFSETS) {
      addCandidate(candidates, x + dx, y + dy);
    }
  }
  return candidates;
};

export const nextGeneration = (cells: Cell[]): Cell[] => {
  const liveSet = new Set<string>(cells.map(([x, y]) => key(x, y)));
  const candidates = collectCandidates(cells);

  return Array.from(candidates).
    filter(([k, [x, y]]) => survives(liveSet.has(k), countLiveNeighbors(x, y, liveSet))).
    map(([, cell]) => cell);
};
