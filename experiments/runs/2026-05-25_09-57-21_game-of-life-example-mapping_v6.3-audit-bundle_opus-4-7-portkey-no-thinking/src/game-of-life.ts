/** A cell's position on the infinite grid as [x, y] coordinates. */
export type Cell = [number, number];

type CellKey = string;

const toKey = ([x, y]: Cell): CellKey => `${x},${y}`;

/**
 * Computes the next generation of Conway's Game of Life from the
 * given set of currently live cells, returning the cells that are
 * alive in the following tick.
 */
export function nextGeneration(liveCells: Cell[]): Cell[] {
  const liveKeys = new Set(liveCells.map(toKey));
  const isAlive = (cell: Cell, neighbors: number) =>
    neighbors === 3 || (neighbors === 2 && liveKeys.has(toKey(cell)));

  return Array.from(countNeighbors(liveCells).values())
    .filter(({ neighbors, cell }) => isAlive(cell, neighbors))
    .map(({ cell }) => cell);
}

type CellWithCount = { cell: Cell; neighbors: number };

function countNeighbors(liveCells: Cell[]): Map<CellKey, CellWithCount> {
  const counts = new Map<CellKey, CellWithCount>();
  for (const [x, y] of liveCells) {
    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        if (dx === 0 && dy === 0) continue;
        const cell: Cell = [x + dx, y + dy];
        const key = toKey(cell);
        const entry = counts.get(key) ?? { cell, neighbors: 0 };
        entry.neighbors++;
        counts.set(key, entry);
      }
    }
  }
  return counts;
}
