export type Cell = [number, number]; // [x, y]

const NEIGHBOR_OFFSETS: ReadonlyArray<readonly [number, number]> = [
  [-1, -1],
  [0, -1],
  [1, -1],
  [-1, 0],
  [1, 0],
  [-1, 1],
  [0, 1],
  [1, 1],
];

const cellKey = (cell: Cell): string => `${cell[0]},${cell[1]}`;

const parseKey = (key: string): Cell => {
  const [xStr, yStr] = key.split(",");
  return [Number(xStr), Number(yStr)];
};

const neighbors = (cell: Cell): Cell[] =>
  NEIGHBOR_OFFSETS.map(([dx, dy]) => [cell[0] + dx, cell[1] + dy]);

function countLiveNeighbors(
  candidate: Cell,
  live: ReadonlySet<string>,
): number {
  let count = 0;
  for (const neighbor of neighbors(candidate)) {
    if (live.has(cellKey(neighbor))) {
      count++;
    }
  }
  return count;
}

// Game of Life rules:
//   Rule 1/2 -- a live cell with 2 or 3 neighbors survives.
//   Rule 4   -- a dead cell with exactly 3 neighbors is born.
//   Rule 3   -- everything else (over- or under-population) dies.
const shouldLive = (isLive: boolean, neighborCount: number): boolean =>
  isLive
    ? neighborCount === 2 || neighborCount === 3
    : neighborCount === 3;

export function nextGeneration(cells: Cell[]): Cell[] {
  // Candidate cells: every live cell + every dead neighbor of a live cell.
  const live = new Set<string>();
  const candidates = new Set<string>();
  for (const cell of cells) {
    const key = cellKey(cell);
    live.add(key);
    candidates.add(key);
    for (const neighbor of neighbors(cell)) {
      candidates.add(cellKey(neighbor));
    }
  }

  const next: Cell[] = [];
  for (const key of candidates) {
    const cell = parseKey(key);
    if (shouldLive(live.has(key), countLiveNeighbors(cell, live))) {
      next.push(cell);
    }
  }

  next.sort((a, b) => (a[0] === b[0] ? a[1] - b[1] : a[0] - b[0]));
  return next;
}
