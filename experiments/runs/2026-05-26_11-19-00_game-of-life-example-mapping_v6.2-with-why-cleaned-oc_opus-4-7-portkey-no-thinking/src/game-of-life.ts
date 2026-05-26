export type Cell = [number, number];

const NEIGHBOR_OFFSETS: ReadonlyArray<Cell> = [
  [-1, -1], [-1, 0], [-1, 1],
  [ 0, -1],          [ 0, 1],
  [ 1, -1], [ 1, 0], [ 1, 1],
];

const cellKey = ([x, y]: Cell): string => `${x},${y}`;

export function nextGeneration(liveCells: Cell[]): Cell[] {
  const liveKeys = new Set(liveCells.map(cellKey));
  const neighborCounts = countLiveNeighborsOfEveryAffectedCell(liveCells);

  const survivors: Cell[] = [];
  for (const [key, { cell, count }] of neighborCounts) {
    if (cellLivesNextGeneration(liveKeys.has(key), count)) {
      survivors.push(cell);
    }
  }
  return survivors;
}

type NeighborTally = { cell: Cell; count: number };

function countLiveNeighborsOfEveryAffectedCell(liveCells: Cell[]): Map<string, NeighborTally> {
  const tallies = new Map<string, NeighborTally>();
  for (const [x, y] of liveCells) {
    for (const [dx, dy] of NEIGHBOR_OFFSETS) {
      const neighbor: Cell = [x + dx, y + dy];
      const key = cellKey(neighbor);
      const tally = tallies.get(key) ?? { cell: neighbor, count: 0 };
      tally.count += 1;
      tallies.set(key, tally);
    }
  }
  return tallies;
}

function cellLivesNextGeneration(isAlive: boolean, liveNeighbors: number): boolean {
  return liveNeighbors === 3 || (isAlive && liveNeighbors === 2);
}
