export type Cell = [x: number, y: number];

type NeighborTally = { cell: Cell; liveNeighbors: number };

const NEIGHBOR_OFFSETS: ReadonlyArray<Cell> = [
  [-1, -1], [-1, 0], [-1, 1],
  [ 0, -1],          [ 0, 1],
  [ 1, -1], [ 1, 0], [ 1, 1],
];

export function nextGeneration(liveCells: Cell[]): Cell[] {
  const liveKeys = new Set(liveCells.map(toKey));
  const tallies = tallyLiveNeighbors(liveCells);

  return [...tallies].flatMap(([key, { cell, liveNeighbors }]) =>
    cellWillLive(liveKeys.has(key), liveNeighbors) ? [cell] : [],
  );
}

function cellWillLive(isAlive: boolean, liveNeighbors: number): boolean {
  return liveNeighbors === 3 || (isAlive && liveNeighbors === 2);
}

function tallyLiveNeighbors(liveCells: Cell[]): Map<string, NeighborTally> {
  const tallies = new Map<string, NeighborTally>();
  for (const [x, y] of liveCells) {
    for (const [dx, dy] of NEIGHBOR_OFFSETS) {
      const neighbor: Cell = [x + dx, y + dy];
      const key = toKey(neighbor);
      const prior = tallies.get(key)?.liveNeighbors ?? 0;
      tallies.set(key, { cell: neighbor, liveNeighbors: prior + 1 });
    }
  }
  return tallies;
}

function toKey([x, y]: Cell): string {
  return `${x},${y}`;
}
