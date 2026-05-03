export type Cell = string;

const parseCell = (cell: Cell): [number, number] => {
  const [x, y] = cell.split(",").map(Number);
  return [x, y];
};

const cellKey = (x: number, y: number): Cell => `${x},${y}`;

const neighborOffsets: ReadonlyArray<[number, number]> = [
  [-1, -1], [-1, 0], [-1, 1],
  [0, -1],           [0, 1],
  [1, -1],  [1, 0],  [1, 1],
];

const countLiveNeighbors = (cell: Cell, living: Set<Cell>): number => {
  const [x, y] = parseCell(cell);
  let count = 0;
  for (const [dx, dy] of neighborOffsets) {
    if (living.has(cellKey(x + dx, y + dy))) count++;
  }
  return count;
};

const candidateCells = (living: Set<Cell>): Set<Cell> => {
  const candidates = new Set<Cell>(living);
  for (const cell of living) {
    const [x, y] = parseCell(cell);
    for (const [dx, dy] of neighborOffsets) {
      candidates.add(cellKey(x + dx, y + dy));
    }
  }
  return candidates;
};

export const nextGeneration = (living: Set<Cell>): Set<Cell> => {
  const result = new Set<Cell>();
  for (const cell of candidateCells(living)) {
    const neighbors = countLiveNeighbors(cell, living);
    const isAlive = living.has(cell);
    if (neighbors === 3 || (isAlive && neighbors === 2)) result.add(cell);
  }
  return result;
};
