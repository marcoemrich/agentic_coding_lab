export type Cell = [number, number];

const NEIGHBORS_TO_SURVIVE = 2;
const NEIGHBORS_TO_BIRTH = 3;

const cellKey = ([x, y]: Cell): string => `${x},${y}`;

const NEIGHBOR_OFFSETS: ReadonlyArray<Cell> = [
  [-1, -1], [-1, 0], [-1, 1],
  [ 0, -1],          [ 0, 1],
  [ 1, -1], [ 1, 0], [ 1, 1],
];

type NeighborTally = { cell: Cell; count: number };

const tallyLiveNeighbors = (cells: Cell[]): Map<string, NeighborTally> => {
  const tallies = new Map<string, NeighborTally>();
  for (const [x, y] of cells) {
    for (const [dx, dy] of NEIGHBOR_OFFSETS) {
      const neighbor: Cell = [x + dx, y + dy];
      const k = cellKey(neighbor);
      const previousCount = tallies.get(k)?.count ?? 0;
      tallies.set(k, { cell: neighbor, count: previousCount + 1 });
    }
  }
  return tallies;
};

const isAliveNext = (neighborCount: number, isAlive: boolean): boolean =>
  neighborCount === NEIGHBORS_TO_BIRTH ||
  (neighborCount === NEIGHBORS_TO_SURVIVE && isAlive);

export function nextGeneration(cells: Cell[]): Cell[] {
  const alive = new Set(cells.map(cellKey));
  const tallies = tallyLiveNeighbors(cells);

  const next: Cell[] = [];
  for (const [k, { cell, count }] of tallies) {
    if (isAliveNext(count, alive.has(k))) next.push(cell);
  }
  return next;
}
