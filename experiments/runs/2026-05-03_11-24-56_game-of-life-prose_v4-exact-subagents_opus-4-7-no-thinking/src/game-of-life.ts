type Cell = string;

const keyOf = (x: number, y: number): Cell => `${x},${y}`;

const NEIGHBOR_OFFSETS: ReadonlyArray<readonly [number, number]> = [
  [-1, -1], [-1, 0], [-1, 1],
  [ 0, -1],          [ 0, 1],
  [ 1, -1], [ 1, 0], [ 1, 1],
];

const neighborsOf = (cell: Cell): Cell[] => {
  const [x, y] = cell.split(",").map(Number);
  return NEIGHBOR_OFFSETS.map(([dx, dy]) => keyOf(x + dx, y + dy));
};

const countLiveNeighbors = (cell: Cell, livingCells: Set<Cell>): number =>
  neighborsOf(cell).filter((neighbor) => livingCells.has(neighbor)).length;

const candidateCells = (livingCells: Set<Cell>): Set<Cell> => {
  const candidates = new Set<Cell>();
  for (const cell of livingCells) {
    candidates.add(cell);
    for (const neighbor of neighborsOf(cell)) candidates.add(neighbor);
  }
  return candidates;
};

const isAliveNextGen = (cell: Cell, livingCells: Set<Cell>): boolean => {
  const liveNeighbors = countLiveNeighbors(cell, livingCells);
  const isCurrentlyAlive = livingCells.has(cell);
  return liveNeighbors === 3 || (isCurrentlyAlive && liveNeighbors === 2);
};

export const nextGeneration = (livingCells: Set<Cell>): Set<Cell> =>
  new Set(
    [...candidateCells(livingCells)].filter((cell) => isAliveNextGen(cell, livingCells))
  );
