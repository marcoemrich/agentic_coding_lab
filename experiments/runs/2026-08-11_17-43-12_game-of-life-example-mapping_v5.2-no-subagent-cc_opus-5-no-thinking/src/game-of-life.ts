export type Cell = [number, number];

// A dead cell with exactly this many live neighbours is born (Rule 4); a live
// cell with this many stays alive (Rule 2).
const NEIGHBOURS_FOR_REPRODUCTION = 3;
// A live cell also survives on one fewer (Rule 2). Fewer than this is
// underpopulation (Rule 1); more than NEIGHBOURS_FOR_REPRODUCTION is
// overpopulation (Rule 3).
const MINIMUM_NEIGHBOURS_TO_SURVIVE = 2;

const keyOf = ([x, y]: Cell): string => `${x},${y}`;

const neighboursOf = ([x, y]: Cell): Cell[] => {
  const neighbours: Cell[] = [];
  for (let dx = -1; dx <= 1; dx++) {
    for (let dy = -1; dy <= 1; dy++) {
      if (dx !== 0 || dy !== 0) neighbours.push([x + dx, y + dy]);
    }
  }
  return neighbours;
};

export function nextGeneration(cells: Cell[]): Cell[] {
  const living = new Set(cells.map(keyOf));
  const isLiving = (cell: Cell): boolean => living.has(keyOf(cell));

  // A cell can only change state if it is alive or borders a living cell, so
  // these are the only cells the infinite grid needs examining.
  const candidates = new Map<string, Cell>();
  for (const cell of cells) {
    candidates.set(keyOf(cell), cell);
    for (const neighbour of neighboursOf(cell)) {
      candidates.set(keyOf(neighbour), neighbour);
    }
  }

  const nextCells: Cell[] = [];
  for (const cell of candidates.values()) {
    const liveNeighbours = neighboursOf(cell).filter(isLiving).length;
    const reproduces = liveNeighbours === NEIGHBOURS_FOR_REPRODUCTION;
    const survives =
      isLiving(cell) && liveNeighbours === MINIMUM_NEIGHBOURS_TO_SURVIVE;
    if (reproduces || survives) {
      nextCells.push(cell);
    }
  }
  return nextCells;
}
