type Cell = [number, number];

const toKey = (x: number, y: number): string => `${x},${y}`;

const fromKey = (key: string): Cell => {
  const parts = key.split(",");
  return [Number(parts[0]), Number(parts[1])];
};

const SURVIVAL_NEIGHBORS = 2;
const BIRTH_NEIGHBORS = 3;

const countNeighbors = (x: number, y: number, liveSet: Set<string>): number => {
  let count = 0;
  for (let dx = -1; dx <= 1; dx++) {
    for (let dy = -1; dy <= 1; dy++) {
      if (dx === 0 && dy === 0) continue;
      if (liveSet.has(toKey(x + dx, y + dy))) count++;
    }
  }
  return count;
};

const getCandidateKeys = (cells: Cell[]): Set<string> => {
  const candidates = new Set<string>();
  for (const [x, y] of cells) {
    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        candidates.add(toKey(x + dx, y + dy));
      }
    }
  }
  return candidates;
};

export function nextGeneration(cells: Cell[]): Cell[] {
  const liveSet = new Set(cells.map(([x, y]) => toKey(x, y)));
  const candidates = getCandidateKeys(cells);
  const result: Cell[] = [];
  for (const key of candidates) {
    const [x, y] = fromKey(key);
    const neighbors = countNeighbors(x, y, liveSet);
    const alive = liveSet.has(key);
    if (neighbors === BIRTH_NEIGHBORS ||
        (alive && neighbors === SURVIVAL_NEIGHBORS)) {
      result.push([x, y]);
    }
  }
  return result;
}
