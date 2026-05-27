export type Cell = [number, number];

const NEIGHBOUR_OFFSETS: ReadonlyArray<Cell> = [
  [-1, -1], [0, -1], [1, -1],
  [-1,  0],          [1,  0],
  [-1,  1], [0,  1], [1,  1],
];

const cellKey = ([x, y]: Cell): string => `${x},${y}`;

// Conway's rules collapsed:
//   - A live cell with 2 live neighbours survives  (Rule 2 Survival)
//   - Any cell with exactly 3 live neighbours is alive next generation
//     (Rule 2 Survival for live cells, Rule 4 Reproduction for dead cells)
//   - Anything else dies or stays dead (Rules 1 Underpopulation, 3 Overpopulation)
const isAliveNextGeneration = (wasAlive: boolean, liveNeighbours: number): boolean =>
  liveNeighbours === 3 || (wasAlive && liveNeighbours === 2);

export function nextGeneration(cells: Cell[]): Cell[] {
  const liveKeys = new Set(cells.map(cellKey));

  // For every cell adjacent to a live cell, record how many live neighbours
  // it has. Any cell not in this map has 0 live neighbours, so it cannot
  // become or stay alive.
  const neighbourCounts = new Map<string, { cell: Cell; count: number }>();
  for (const [x, y] of cells) {
    for (const [dx, dy] of NEIGHBOUR_OFFSETS) {
      const neighbour: Cell = [x + dx, y + dy];
      const k = cellKey(neighbour);
      const entry = neighbourCounts.get(k);
      if (entry) entry.count++;
      else neighbourCounts.set(k, { cell: neighbour, count: 1 });
    }
  }

  const next: Cell[] = [];
  for (const [k, { cell, count }] of neighbourCounts) {
    if (isAliveNextGeneration(liveKeys.has(k), count)) {
      next.push(cell);
    }
  }
  return next;
}
