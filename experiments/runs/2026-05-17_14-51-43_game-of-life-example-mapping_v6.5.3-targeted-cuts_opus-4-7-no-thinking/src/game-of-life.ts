export type Cell = [number, number];

const NEIGHBOR_OFFSETS: ReadonlyArray<Cell> = [
  [-1, -1], [-1, 0], [-1, 1],
  [ 0, -1],          [ 0, 1],
  [ 1, -1], [ 1, 0], [ 1, 1],
];

const cellKey = ([x, y]: Cell): string => `${x},${y}`;

const countLiveNeighbors = ([x, y]: Cell, alive: ReadonlySet<string>): number =>
  NEIGHBOR_OFFSETS.filter(([dx, dy]) => alive.has(cellKey([x + dx, y + dy]))).length;

const isAliveNextGen = (isCurrentlyAlive: boolean, neighbors: number): boolean =>
  neighbors === 3 || (isCurrentlyAlive && neighbors === 2);

const SELF_AND_NEIGHBORS: ReadonlyArray<Cell> = [[0, 0], ...NEIGHBOR_OFFSETS];

const candidateCells = (cells: ReadonlyArray<Cell>): Map<string, Cell> => {
  const candidates = new Map<string, Cell>();
  for (const [x, y] of cells) {
    for (const [dx, dy] of SELF_AND_NEIGHBORS) {
      const cell: Cell = [x + dx, y + dy];
      candidates.set(cellKey(cell), cell);
    }
  }
  return candidates;
};

export function nextGeneration(cells: Cell[]): Cell[] {
  const alive = new Set(cells.map(cellKey));
  return [...candidateCells(cells)]
    .filter(([key, cell]) => isAliveNextGen(alive.has(key), countLiveNeighbors(cell, alive)))
    .map(([, cell]) => cell);
}
