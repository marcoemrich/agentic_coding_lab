export type Cell = [number, number];

const key = ([x, y]: Cell): string => `${x},${y}`;

const NEIGHBOR_OFFSETS: Cell[] = [
  [-1, -1], [-1, 0], [-1, 1],
  [ 0, -1],          [ 0, 1],
  [ 1, -1], [ 1, 0], [ 1, 1],
];

type NeighborTally = Map<string, { cell: Cell; count: number }>;

const tallyNeighbors = (cells: Cell[]): NeighborTally => {
  const tally: NeighborTally = new Map();
  for (const [x, y] of cells) {
    for (const [dx, dy] of NEIGHBOR_OFFSETS) {
      const neighbor: Cell = [x + dx, y + dy];
      const k = key(neighbor);
      const entry = tally.get(k);
      if (entry) {
        entry.count++;
      } else {
        tally.set(k, { cell: neighbor, count: 1 });
      }
    }
  }
  return tally;
};

const isAliveNext = (neighborCount: number, wasAlive: boolean): boolean =>
  neighborCount === 3 || (neighborCount === 2 && wasAlive);

export function nextGeneration(cells: Cell[]): Cell[] {
  const alive = new Set<string>(cells.map(key));
  const tally = tallyNeighbors(cells);

  const next: Cell[] = [];
  for (const [k, { cell, count }] of tally) {
    if (isAliveNext(count, alive.has(k))) next.push(cell);
  }
  return next;
}
