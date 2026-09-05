export type Cell = [number, number];

const NEIGHBOR_OFFSETS: Cell[] = [
  [-1, -1], [-1, 0], [-1, 1],
  [0, -1], [0, 1],
  [1, -1], [1, 0], [1, 1],
];

function neighbors([x, y]: Cell): Cell[] {
  return NEIGHBOR_OFFSETS.map(([dx, dy]) => [x + dx, y + dy]);
}

/** Two cells are the same cell exactly when their coordinates match. */
function cellKey([x, y]: Cell): string {
  return `${x},${y}`;
}

function isAlive(cell: Cell, liveKeys: Set<string>): boolean {
  return liveKeys.has(cellKey(cell));
}

function liveNeighborCount(cell: Cell, liveKeys: Set<string>): number {
  return neighbors(cell).filter((neighbor) => isAlive(neighbor, liveKeys)).length;
}

/**
 * A birth needs 3 live neighbours, so no cell outside this set can be alive
 * next generation. Keying by coordinate collapses the cells reached from
 * several live neighbours into one candidate.
 */
function candidateCells(liveCells: Cell[]): Cell[] {
  const byKey = new Map(
    liveCells.flatMap((cell) => [cell, ...neighbors(cell)])
      .map((cell) => [cellKey(cell), cell]),
  );
  return [...byKey.values()];
}

function survives(neighborCount: number): boolean {
  return neighborCount === 2 || neighborCount === 3;
}

function isBorn(neighborCount: number): boolean {
  return neighborCount === 3;
}

export function nextGeneration(liveCells: Cell[]): Cell[] {
  const liveKeys = new Set(liveCells.map(cellKey));
  return candidateCells(liveCells).filter((cell) => {
    const neighborCount = liveNeighborCount(cell, liveKeys);
    return isAlive(cell, liveKeys) ? survives(neighborCount) : isBorn(neighborCount);
  });
}
