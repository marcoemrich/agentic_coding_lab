export type Cell = [x: number, y: number];

const keyOf = ([x, y]: Cell): string => `${x},${y}`;

const NEIGHBOR_OFFSETS: Cell[] = [
  [-1, -1],
  [-1, 0],
  [-1, 1],
  [0, -1],
  [0, 1],
  [1, -1],
  [1, 0],
  [1, 1],
];

const neighborsOf = ([x, y]: Cell): Cell[] =>
  NEIGHBOR_OFFSETS.map(([dx, dy]): Cell => [x + dx, y + dy]);

type LiveSet = ReadonlySet<string>;

const countLiveNeighbors = (cell: Cell, live: LiveSet): number =>
  neighborsOf(cell).filter((neighbor) => live.has(keyOf(neighbor))).length;

const NEIGHBORS_FOR_BIRTH = 3;
const NEIGHBORS_FOR_SURVIVAL = 2;

const isLiveNextGeneration = (cell: Cell, live: LiveSet): boolean => {
  const neighborCount = countLiveNeighbors(cell, live);
  return (
    neighborCount === NEIGHBORS_FOR_BIRTH ||
    (neighborCount === NEIGHBORS_FOR_SURVIVAL && live.has(keyOf(cell)))
  );
};

const cellsThatCouldChange = (liveCells: Cell[]): Cell[] => {
  const affected = [...liveCells, ...liveCells.flatMap(neighborsOf)];
  return [...new Map(affected.map((cell) => [keyOf(cell), cell])).values()];
};

export function nextGeneration(liveCells: Cell[]): Cell[] {
  const live: LiveSet = new Set(liveCells.map(keyOf));
  return cellsThatCouldChange(liveCells).filter((cell) =>
    isLiveNextGeneration(cell, live),
  );
}
