export type Cell = [number, number];

const keyOf = ([x, y]: Cell): string => `${x},${y}`;

const neighborsOf = ([x, y]: Cell): Cell[] => [
  [x - 1, y - 1],
  [x, y - 1],
  [x + 1, y - 1],
  [x - 1, y],
  [x + 1, y],
  [x - 1, y + 1],
  [x, y + 1],
  [x + 1, y + 1],
];

// Rule 2: a live cell with two or three live neighbors lives on.
// Rules 1 and 3 are the complement: fewer than two is underpopulation,
// more than three is overpopulation, and either way the cell dies.
const survives = (liveNeighbors: number): boolean =>
  liveNeighbors === 2 || liveNeighbors === 3;

// Rule 4: a dead cell with exactly three live neighbors becomes alive.
const isBorn = (liveNeighbors: number): boolean => liveNeighbors === 3;

// Only a live cell or a neighbor of one can be alive next generation;
// every other cell has no live neighbors and stays dead.
const candidatesFrom = (liveCells: Cell[]): Cell[] =>
  deduplicate(liveCells.flatMap((cell) => [cell, ...neighborsOf(cell)]));

const deduplicate = (cells: Cell[]): Cell[] => [
  ...new Map(cells.map((cell) => [keyOf(cell), cell])).values(),
];

// Builds a membership test over the current generation, by canonical key.
const aliveTestFor = (liveCells: Cell[]): ((cell: Cell) => boolean) => {
  const living = new Set(liveCells.map(keyOf));
  return (cell) => living.has(keyOf(cell));
};

export function nextGeneration(liveCells: Cell[]): Cell[] {
  const isAlive = aliveTestFor(liveCells);

  const isAliveNextGeneration = (cell: Cell): boolean => {
    const liveNeighbors = neighborsOf(cell).filter(isAlive).length;
    return isAlive(cell) ? survives(liveNeighbors) : isBorn(liveNeighbors);
  };

  return candidatesFrom(liveCells).filter(isAliveNextGeneration);
}
