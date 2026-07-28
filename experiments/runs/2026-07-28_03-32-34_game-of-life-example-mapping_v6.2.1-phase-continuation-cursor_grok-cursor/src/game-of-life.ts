export type Cell = [number, number];

const NEIGHBOR_OFFSETS: Cell[] = [
  [-1, -1], [-1, 0], [-1, 1],
  [0, -1],           [0, 1],
  [1, -1],  [1, 0],  [1, 1],
];

function cellKey(x: number, y: number): string {
  return `${x},${y}`;
}

function countNeighbors(liveSet: Set<string>, x: number, y: number): number {
  let count = 0;
  for (const [dx, dy] of NEIGHBOR_OFFSETS) {
    if (liveSet.has(cellKey(x + dx, y + dy))) count++;
  }
  return count;
}

export function nextGeneration(liveCells: Cell[]): Cell[] {
  const liveSet = new Set(liveCells.map(([x, y]) => cellKey(x, y)));
  const candidates = new Set<string>();

  for (const [x, y] of liveCells) {
    candidates.add(cellKey(x, y));
    for (const [dx, dy] of NEIGHBOR_OFFSETS) {
      candidates.add(cellKey(x + dx, y + dy));
    }
  }

  const next: Cell[] = [];
  for (const key of candidates) {
    const [x, y] = key.split(",").map(Number) as [number, number];
    const neighbors = countNeighbors(liveSet, x, y);
    const alive = liveSet.has(key);
    if (alive && (neighbors === 2 || neighbors === 3)) {
      next.push([x, y]);
    } else if (!alive && neighbors === 3) {
      next.push([x, y]);
    }
  }
  return next;
}
