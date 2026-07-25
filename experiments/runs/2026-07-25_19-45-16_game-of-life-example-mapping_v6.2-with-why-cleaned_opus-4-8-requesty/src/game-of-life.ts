export type Cell = [number, number];

const key = ([x, y]: Cell): string => `${x},${y}`;

// The eight cells surrounding any cell (self excluded).
const NEIGHBOUR_OFFSETS: Cell[] = [
  [-1, -1], [-1, 0], [-1, 1],
  [0, -1], [0, 1],
  [1, -1], [1, 0], [1, 1],
];

const survivesToNextGeneration = (isAlive: boolean, liveNeighbours: number): boolean =>
  liveNeighbours === 3 || (isAlive && liveNeighbours === 2);

// For every cell that touches a live cell, tally how many live neighbours it
// has. Coordinates are kept alongside the count so the caller never has to
// decode the string key back into numbers.
const countLiveNeighbours = (cells: Cell[]): Map<string, { cell: Cell; count: number }> => {
  const counts = new Map<string, { cell: Cell; count: number }>();
  for (const [x, y] of cells) {
    for (const [dx, dy] of NEIGHBOUR_OFFSETS) {
      const cell: Cell = [x + dx, y + dy];
      const cellKey = key(cell);
      const entry = counts.get(cellKey) ?? { cell, count: 0 };
      entry.count++;
      counts.set(cellKey, entry);
    }
  }
  return counts;
};

export function nextGeneration(cells: Cell[]): Cell[] {
  const liveSet = new Set(cells.map(key));
  const neighbourCounts = countLiveNeighbours(cells);

  // A dead cell with exactly 3 live neighbours is born (reproduction);
  // a live cell with 2 or 3 live neighbours survives.
  const next: Cell[] = [];
  for (const [cellKey, { cell, count }] of neighbourCounts) {
    if (survivesToNextGeneration(liveSet.has(cellKey), count)) {
      next.push(cell);
    }
  }
  return next;
}
