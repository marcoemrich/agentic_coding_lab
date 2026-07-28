export type Cell = [number, number];

const NEIGHBOR_OFFSETS: ReadonlyArray<readonly [number, number]> = [
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

function countNeighbors(
  x: number,
  y: number,
  live: ReadonlySet<string>
): number {
  let count = 0;
  for (const [dx, dy] of NEIGHBOR_OFFSETS) {
    if (live.has(cellKey(x + dx, y + dy))) count++;
  }
  return count;
}

function cellSurvives(neighborCount: number): boolean {
  return neighborCount === 2 || neighborCount === 3;
}

function cellIsBorn(neighborCount: number): boolean {
  return neighborCount === 3;
}

export function nextGeneration(liveCells: readonly Cell[]): Cell[] {
  const live = new Set(liveCells.map(([x, y]) => cellKey(x, y)));
  const next: Cell[] = [];

  for (const [x, y] of liveCells) {
    const neighbors = countNeighbors(x, y, live);
    if (cellSurvives(neighbors)) {
      next.push([x, y]);
    }
  }

  const birthCandidates = new Set<string>();
  for (const [x, y] of liveCells) {
    for (const [dx, dy] of NEIGHBOR_OFFSETS) {
      const key = cellKey(x + dx, y + dy);
      if (!live.has(key)) {
        birthCandidates.add(key);
      }
    }
  }

  for (const key of birthCandidates) {
    const [x, y] = key.split(",").map(Number) as [number, number];
    const neighbors = countNeighbors(x, y, live);
    if (cellIsBorn(neighbors)) {
      next.push([x, y]);
    }
  }

  return next;
}
