export type Cell = [number, number];

const NEIGHBOR_OFFSETS: Cell[] = [
  [-1, -1], [-1, 0], [-1, 1],
  [ 0, -1],          [ 0, 1],
  [ 1, -1], [ 1, 0], [ 1, 1],
];

const toKey = ([x, y]: Cell): string => `${x},${y}`;

const shouldLive = (isAlive: boolean, neighbors: number): boolean =>
  neighbors === 3 || (isAlive && neighbors === 2);

type NeighborTally = { cell: Cell; count: number };

function tallyNeighbors(cells: Cell[]): Map<string, NeighborTally> {
  const tallies = new Map<string, NeighborTally>();
  for (const [x, y] of cells) {
    for (const [dx, dy] of NEIGHBOR_OFFSETS) {
      const cell: Cell = [x + dx, y + dy];
      const key = toKey(cell);
      const tally = tallies.get(key) ?? { cell, count: 0 };
      tally.count += 1;
      tallies.set(key, tally);
    }
  }
  return tallies;
}

export function nextGeneration(cells: Cell[]): Cell[] {
  const liveKeys = new Set(cells.map(toKey));
  const tallies = tallyNeighbors(cells);

  const result: Cell[] = [];
  for (const [key, { cell, count }] of tallies) {
    if (shouldLive(liveKeys.has(key), count)) {
      result.push(cell);
    }
  }
  return result;
}
