export type Cell = [number, number];

const NEIGHBOR_OFFSETS: ReadonlyArray<Cell> = [
  [-1, -1], [-1, 0], [-1, 1],
  [ 0, -1],          [ 0, 1],
  [ 1, -1], [ 1, 0], [ 1, 1],
];

const keyOf = ([x, y]: Cell): string => `${x},${y}`;

type NeighborTally = { cell: Cell; liveNeighbors: number };

export function nextGeneration(cells: Cell[]): Cell[] {
  const liveKeys = new Set(cells.map(keyOf));
  const tallies = tallyLiveNeighbors(cells);

  const nextCells: Cell[] = [];
  for (const [key, { cell, liveNeighbors }] of tallies) {
    if (survivesOrBorn(liveKeys.has(key), liveNeighbors)) {
      nextCells.push(cell);
    }
  }
  return nextCells;
}

function tallyLiveNeighbors(cells: Cell[]): Map<string, NeighborTally> {
  const tallies = new Map<string, NeighborTally>();
  for (const [x, y] of cells) {
    for (const [dx, dy] of NEIGHBOR_OFFSETS) {
      incrementNeighbor(tallies, [x + dx, y + dy]);
    }
  }
  return tallies;
}

function incrementNeighbor(tallies: Map<string, NeighborTally>, cell: Cell): void {
  const key = keyOf(cell);
  const tally = tallies.get(key) ?? { cell, liveNeighbors: 0 };
  tally.liveNeighbors += 1;
  tallies.set(key, tally);
}

// Conway's B3/S23: dead cell born with exactly 3 neighbors;
// live cell survives with 2 or 3 neighbors.
function survivesOrBorn(isAlive: boolean, neighborCount: number): boolean {
  return neighborCount === 3 || (isAlive && neighborCount === 2);
}
