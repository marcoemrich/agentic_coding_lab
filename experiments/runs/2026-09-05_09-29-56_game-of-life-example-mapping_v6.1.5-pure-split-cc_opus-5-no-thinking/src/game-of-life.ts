export type Cell = [number, number];

const cellKey = ([x, y]: Cell): string => `${x},${y}`;

const neighbors = ([x, y]: Cell): Cell[] => [
  [x - 1, y - 1],
  [x, y - 1],
  [x + 1, y - 1],
  [x - 1, y],
  [x + 1, y],
  [x - 1, y + 1],
  [x, y + 1],
  [x + 1, y + 1],
];

const NEIGHBORS_TO_BE_BORN = 3;
const NEIGHBORS_TO_SURVIVE = 2;

// Covers both survival (a live cell persisting) and birth (a dead cell with
// exactly 3 live neighbours coming alive) — hence "isAlive", not "survives".
const isAliveNextGeneration = (
  liveNeighbors: number,
  isCurrentlyAlive: boolean,
): boolean =>
  liveNeighbors === NEIGHBORS_TO_BE_BORN ||
  (liveNeighbors === NEIGHBORS_TO_SURVIVE && isCurrentlyAlive);

export function nextGeneration(cells: Cell[]): Cell[] {
  const livingKeys = new Set(cells.map(cellKey));

  // Every live cell casts one vote for each of its 8 neighbors, so this tally
  // holds both the candidate cells and their live-neighbor counts in one pass.
  const tally = new Map<string, { cell: Cell; liveNeighbors: number }>();
  for (const cell of cells) {
    for (const neighbor of neighbors(cell)) {
      const key = cellKey(neighbor);
      const entry = tally.get(key) ?? { cell: neighbor, liveNeighbors: 0 };
      entry.liveNeighbors += 1;
      tally.set(key, entry);
    }
  }

  const nextCells: Cell[] = [];
  for (const [key, { cell, liveNeighbors }] of tally) {
    if (isAliveNextGeneration(liveNeighbors, livingKeys.has(key))) {
      nextCells.push(cell);
    }
  }

  return nextCells;
}
