type Cell = [number, number];

const toKey = (x: number, y: number): string => `${x},${y}`;

const NEIGHBOR_OFFSETS = [
  [-1, -1], [-1, 0], [-1, 1],
  [0, -1],           [0, 1],
  [1, -1],  [1, 0],  [1, 1],
] as const;

const SURVIVAL_NEIGHBORS = 2;
const BIRTH_NEIGHBORS = 3;

const countLiveNeighbors = (x: number, y: number, liveSet: Set<string>): number =>
  NEIGHBOR_OFFSETS.reduce(
    (count, [dx, dy]) => count + (liveSet.has(toKey(x + dx, y + dy)) ? 1 : 0),
    0,
  );

const collectCandidates = (cells: Cell[]): Map<string, Cell> => {
  const candidates = new Map<string, Cell>();
  for (const [x, y] of cells) {
    candidates.set(toKey(x, y), [x, y]);
    for (const [dx, dy] of NEIGHBOR_OFFSETS) {
      const key = toKey(x + dx, y + dy);
      if (!candidates.has(key)) {
        candidates.set(key, [x + dx, y + dy]);
      }
    }
  }
  return candidates;
};

export function nextGeneration(cells: Cell[]): Cell[] {
  const liveSet = new Set(cells.map(([x, y]) => toKey(x, y)));
  const candidates = collectCandidates(cells);

  const result: Cell[] = [];
  for (const [key, [x, y]] of candidates) {
    const neighbors = countLiveNeighbors(x, y, liveSet);
    if (neighbors === BIRTH_NEIGHBORS || (liveSet.has(key) && neighbors === SURVIVAL_NEIGHBORS)) {
      result.push([x, y]);
    }
  }
  return result;
}
