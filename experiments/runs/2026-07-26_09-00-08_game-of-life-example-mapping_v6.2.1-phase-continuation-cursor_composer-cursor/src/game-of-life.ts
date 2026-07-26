export type Cell = [number, number];

const NEIGHBOR_OFFSETS: [number, number][] = [
  [-1, -1],
  [0, -1],
  [1, -1],
  [-1, 0],
  [1, 0],
  [-1, 1],
  [0, 1],
  [1, 1],
];

function cellKey(x: number, y: number): string {
  return `${x},${y}`;
}

function parseCellKey(key: string): Cell {
  const [x, y] = key.split(",").map(Number);
  return [x, y];
}

function countLiveNeighbors(x: number, y: number, live: Set<string>): number {
  return NEIGHBOR_OFFSETS.reduce((count, [dx, dy]) => {
    return live.has(cellKey(x + dx, y + dy)) ? count + 1 : count;
  }, 0);
}

function isAliveNextGeneration(isCurrentlyAlive: boolean, liveNeighbors: number): boolean {
  return (
    (isCurrentlyAlive && (liveNeighbors === 2 || liveNeighbors === 3)) ||
    (!isCurrentlyAlive && liveNeighbors === 3)
  );
}

function collectCandidateCells(liveCells: Cell[]): Set<string> {
  const candidates = new Set<string>();
  for (const [x, y] of liveCells) {
    candidates.add(cellKey(x, y));
    for (const [dx, dy] of NEIGHBOR_OFFSETS) {
      candidates.add(cellKey(x + dx, y + dy));
    }
  }
  return candidates;
}

export function nextGeneration(cells: Cell[]): Cell[] {
  const live = new Set(cells.map(([x, y]) => cellKey(x, y)));
  const candidates = collectCandidateCells(cells);
  const next: Cell[] = [];

  for (const key of candidates) {
    const [x, y] = parseCellKey(key);
    const neighbors = countLiveNeighbors(x, y, live);
    const isAlive = live.has(key);
    if (isAliveNextGeneration(isAlive, neighbors)) {
      next.push([x, y]);
    }
  }

  return next;
}
