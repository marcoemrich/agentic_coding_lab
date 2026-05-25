export type Cell = [number, number];

const NEIGHBOR_OFFSETS: ReadonlyArray<[number, number]> = [
  [-1, -1], [-1, 0], [-1, 1],
  [ 0, -1],          [ 0, 1],
  [ 1, -1], [ 1, 0], [ 1, 1],
];

const cellKey = ([x, y]: Cell): string => `${x},${y}`;

const survivesOrIsBorn = (isAlive: boolean, neighborCount: number): boolean =>
  neighborCount === 3 || (isAlive && neighborCount === 2);

type NeighborTally = { cell: Cell; count: number };

function tallyNeighbors(liveCells: Cell[]): Map<string, NeighborTally> {
  const tallies = new Map<string, NeighborTally>();
  for (const [x, y] of liveCells) {
    for (const [dx, dy] of NEIGHBOR_OFFSETS) {
      const cell: Cell = [x + dx, y + dy];
      const key = cellKey(cell);
      const existing = tallies.get(key);
      tallies.set(key, { cell, count: (existing?.count ?? 0) + 1 });
    }
  }
  return tallies;
}

export function nextGeneration(liveCells: Cell[]): Cell[] {
  const liveKeys = new Set(liveCells.map(cellKey));
  const tallies = tallyNeighbors(liveCells);

  const next: Cell[] = [];
  for (const [key, { cell, count }] of tallies) {
    if (survivesOrIsBorn(liveKeys.has(key), count)) next.push(cell);
  }
  return next;
}
