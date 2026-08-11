export type Cell = [number, number];

type CellKey = string;

const keyOf = ([x, y]: Cell): CellKey => `${x},${y}`;

const cellOf = (key: CellKey): Cell => {
  const [x, y] = key.split(",").map(Number);
  return [x, y];
};

const NEIGHBOR_OFFSETS: Cell[] = [
  [-1, -1], [0, -1], [1, -1],
  [-1, 0],           [1, 0],
  [-1, 1],  [0, 1],  [1, 1],
];

const neighborsOf = ([x, y]: Cell): Cell[] =>
  NEIGHBOR_OFFSETS.map(([dx, dy]): Cell => [x + dx, y + dy]);

function countLiveNeighbors(cell: Cell, liveKeys: Set<CellKey>): number {
  return neighborsOf(cell).filter((neighbor) => liveKeys.has(keyOf(neighbor)))
    .length;
}

// Only live cells and their neighbors can be alive next generation;
// every other cell has no live neighbors and stays dead.
function candidateCells(liveCells: Cell[]): Cell[] {
  const keys = liveCells.flatMap((cell) => [
    keyOf(cell),
    ...neighborsOf(cell).map(keyOf),
  ]);
  return [...new Set(keys)].map(cellOf);
}

function isAliveNextGeneration(cell: Cell, liveKeys: Set<CellKey>): boolean {
  const liveNeighborCount = countLiveNeighbors(cell, liveKeys);
  const isCurrentlyAlive = liveKeys.has(keyOf(cell));

  // A live cell survives on 2 or 3 neighbors (fewer: underpopulation,
  // more: overpopulation); a dead cell is born on exactly 3.
  return isCurrentlyAlive
    ? liveNeighborCount === 2 || liveNeighborCount === 3
    : liveNeighborCount === 3;
}

export function nextGeneration(liveCells: Cell[]): Cell[] {
  const liveKeys = new Set(liveCells.map(keyOf));
  return candidateCells(liveCells).filter((cell) =>
    isAliveNextGeneration(cell, liveKeys),
  );
}
