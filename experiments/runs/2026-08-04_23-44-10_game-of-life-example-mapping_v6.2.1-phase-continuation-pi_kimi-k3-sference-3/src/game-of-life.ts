export type Cell = [number, number];

const NEIGHBOR_OFFSETS: Cell[] = [
  [-1, -1], [0, -1], [1, -1],
  [-1, 0],           [1, 0],
  [-1, 1],  [0, 1],  [1, 1],
];

function survives(liveNeighborCount: number): boolean {
  return liveNeighborCount === 2 || liveNeighborCount === 3;
}

function isBorn(liveNeighborCount: number): boolean {
  return liveNeighborCount === 3;
}

function livesInNextGeneration(isAlive: boolean, liveNeighborCount: number): boolean {
  return isAlive ? survives(liveNeighborCount) : isBorn(liveNeighborCount);
}

function cellKey(x: number, y: number): string {
  return `${x},${y}`;
}

export function nextGeneration(liveCells: Cell[]): Cell[] {
  const live = new Set(liveCells.map(([x, y]) => cellKey(x, y)));
  const neighborCounts = new Map<string, number>();
  for (const [x, y] of liveCells) {
    for (const [dx, dy] of NEIGHBOR_OFFSETS) {
      const key = cellKey(x + dx, y + dy);
      neighborCounts.set(key, (neighborCounts.get(key) ?? 0) + 1);
    }
  }
  const nextLiveCells: Cell[] = [];
  for (const [key, liveNeighborCount] of neighborCounts) {
    const [x, y] = key.split(",").map(Number);
    if (livesInNextGeneration(live.has(key), liveNeighborCount)) {
      nextLiveCells.push([x, y]);
    }
  }
  return nextLiveCells;
}
