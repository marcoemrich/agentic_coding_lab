export type Cell = [number, number];

const NEIGHBOR_OFFSETS: Cell[] = [
  [-1, -1],
  [-1, 0],
  [-1, 1],
  [0, -1],
  [0, 1],
  [1, -1],
  [1, 0],
  [1, 1],
];

function key(x: number, y: number): string {
  return `${x},${y}`;
}

function neighborKeysOf(x: number, y: number): string[] {
  return NEIGHBOR_OFFSETS.map(([dx, dy]) => key(x + dx, y + dy));
}

function countLiveNeighbors(
  x: number,
  y: number,
  liveSet: Set<string>
): number {
  return neighborKeysOf(x, y).filter((neighborKey) => liveSet.has(neighborKey))
    .length;
}

function collectCandidates(liveCells: Cell[]): Set<string> {
  const candidates = new Set<string>();
  for (const [x, y] of liveCells) {
    candidates.add(key(x, y));
    for (const neighborKey of neighborKeysOf(x, y)) {
      candidates.add(neighborKey);
    }
  }
  return candidates;
}

function shouldLive(isAlive: boolean, liveNeighborCount: number): boolean {
  if (isAlive) {
    return liveNeighborCount === 2 || liveNeighborCount === 3;
  }
  return liveNeighborCount === 3;
}

export function nextGeneration(liveCells: Cell[]): Cell[] {
  const liveSet = new Set(liveCells.map(([x, y]) => key(x, y)));
  const candidates = collectCandidates(liveCells);

  const result: Cell[] = [];
  for (const coord of candidates) {
    const [x, y] = coord.split(",").map(Number);
    const liveNeighborCount = countLiveNeighbors(x, y, liveSet);
    if (shouldLive(liveSet.has(coord), liveNeighborCount)) {
      result.push([x, y]);
    }
  }

  return result;
}
