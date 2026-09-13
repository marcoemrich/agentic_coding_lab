type Cell = [number, number];

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

function cellKey(x: number, y: number): string {
  return `${x},${y}`;
}

function countNeighbors(x: number, y: number, liveSet: Set<string>): number {
  let count = 0;
  for (const [dx, dy] of NEIGHBOR_OFFSETS) {
    if (liveSet.has(cellKey(x + dx, y + dy))) {
      count++;
    }
  }
  return count;
}

function survivesOrIsBorn(alive: boolean, neighbors: number): boolean {
  return neighbors === 3 || (alive && neighbors === 2);
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

  const nextLiveCells: Cell[] = [];
  for (const key of candidates) {
    const [x, y] = key.split(",").map(Number) as [number, number];
    const neighbors = countNeighbors(x, y, liveSet);
    if (survivesOrIsBorn(liveSet.has(key), neighbors)) {
      nextLiveCells.push([x, y]);
    }
  }
  return nextLiveCells;
}
