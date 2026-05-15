export type Cell = [number, number];

const cellKey = (x: number, y: number): string => `${x},${y}`;

const isAliveNextGeneration = (isCurrentlyAlive: boolean, liveNeighborCount: number): boolean =>
  liveNeighborCount === 3 || (isCurrentlyAlive && liveNeighborCount === 2);

export function nextGeneration(cells: Cell[]): Cell[] {
  const aliveKeys = new Set(cells.map(([x, y]) => cellKey(x, y)));

  // Single pass: every live cell contributes +1 to each of its 8 neighbors' counts.
  // This naturally enumerates all candidate cells (neighbors of live cells) and
  // computes their live-neighbor counts at the same time.
  const neighborCounts = new Map<string, number>();
  const candidates = new Map<string, Cell>();
  for (const [x, y] of cells) {
    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        if (dx === 0 && dy === 0) continue;
        const nx = x + dx;
        const ny = y + dy;
        const key = cellKey(nx, ny);
        neighborCounts.set(key, (neighborCounts.get(key) ?? 0) + 1);
        candidates.set(key, [nx, ny]);
      }
    }
  }

  // Live cells with zero live neighbors are not in `candidates` yet, but
  // they always die (underpopulation), so we don't need to add them.
  const nextCells: Cell[] = [];
  for (const [key, cell] of candidates) {
    const count = neighborCounts.get(key) ?? 0;
    if (isAliveNextGeneration(aliveKeys.has(key), count)) {
      nextCells.push(cell);
    }
  }
  return nextCells;
}
