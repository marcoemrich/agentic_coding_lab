export type Cell = [number, number];

const cellKey = (x: number, y: number): string => `${x},${y}`;

// The 8 neighbors of any cell, as (dx, dy) offsets.
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

export function nextGeneration(cells: Cell[]): Cell[] {
  const live = new Set(cells.map(([x, y]) => cellKey(x, y)));

  const liveNeighbors = (x: number, y: number): number =>
    NEIGHBOR_OFFSETS.filter(([dx, dy]) =>
      live.has(cellKey(x + dx, y + dy)),
    ).length;

  const next = new Map<string, Cell>();
  const evaluateCell = (x: number, y: number): void => {
    const count = liveNeighbors(x, y);
    const alive = live.has(cellKey(x, y));
    // A cell is alive next generation iff it has exactly 3 live neighbors
    // (reproduction or survival) or is alive with exactly 2 (survival).
    if (count === 3 || (alive && count === 2)) {
      next.set(cellKey(x, y), [x, y]);
    }
  };

  // A cell can only be alive next generation if it is currently alive or is a
  // neighbor of a currently alive cell, so we only need to evaluate those.
  for (const [x, y] of cells) {
    evaluateCell(x, y);
    for (const [dx, dy] of NEIGHBOR_OFFSETS) {
      evaluateCell(x + dx, y + dy);
    }
  }

  return [...next.values()];
}
