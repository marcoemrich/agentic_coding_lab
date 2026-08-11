export type Cell = [number, number];

const MIN_NEIGHBORS_TO_SURVIVE = 2;
const MAX_NEIGHBORS_TO_SURVIVE = 3;
const NEIGHBORS_TO_BE_BORN = 3;

const NEIGHBOR_OFFSETS = [-1, 0, 1];

const key = ([x, y]: Cell): string => `${x},${y}`;

const NEIGHBOR_DELTAS: Cell[] = NEIGHBOR_OFFSETS.flatMap((dx) =>
  NEIGHBOR_OFFSETS.filter((dy) => dx !== 0 || dy !== 0).map(
    (dy): Cell => [dx, dy],
  ),
);

const neighborsOf = ([x, y]: Cell): Cell[] =>
  NEIGHBOR_DELTAS.map(([dx, dy]): Cell => [x + dx, y + dy]);

const countLiveNeighbors = (cell: Cell, aliveKeys: Set<string>): number =>
  neighborsOf(cell).filter((neighbor) => aliveKeys.has(key(neighbor))).length;

const survives = (neighbors: number): boolean =>
  neighbors >= MIN_NEIGHBORS_TO_SURVIVE &&
  neighbors <= MAX_NEIGHBORS_TO_SURVIVE;

const isBorn = (neighbors: number): boolean =>
  neighbors === NEIGHBORS_TO_BE_BORN;

const dedupe = (cells: Cell[]): Cell[] => [
  ...new Map(cells.map((cell) => [key(cell), cell])).values(),
];

const copyOf = ([x, y]: Cell): Cell => [x, y];

// The live cell is copied so the returned generation never aliases the
// caller's input arrays; neighborsOf already produces fresh cells.
const candidateCells = (liveCells: Cell[]): Cell[] =>
  dedupe(liveCells.flatMap((cell) => [copyOf(cell), ...neighborsOf(cell)]));

export function nextGeneration(liveCells: Cell[]): Cell[] {
  const aliveKeys = new Set(liveCells.map(key));

  return candidateCells(liveCells).filter((cell) => {
    const neighbors = countLiveNeighbors(cell, aliveKeys);

    return aliveKeys.has(key(cell)) ? survives(neighbors) : isBorn(neighbors);
  });
}
