export type Cell = [number, number];

/** A cell with this many living neighbors is alive next generation, dead or alive now. */
const NEIGHBORS_TO_BECOME_ALIVE = 3;
/** A cell already alive also stays alive with this many living neighbors. */
const NEIGHBORS_TO_STAY_ALIVE = 2;

const cellId = ([x, y]: Cell): string => `${x},${y}`;

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

export function nextGeneration(cells: Cell[]): Cell[] {
  const living = new Set(cells.map(cellId));
  const countLivingNeighbors = (cell: Cell): number =>
    neighborsOf(cell).filter((neighbor) => living.has(cellId(neighbor))).length;

  const candidates = new Map<string, Cell>(
    [...cells, ...cells.flatMap(neighborsOf)].map((cell) => [cellId(cell), cell]),
  );

  const livesOn = (cell: Cell): boolean => {
    const count = countLivingNeighbors(cell);
    return (
      count === NEIGHBORS_TO_BECOME_ALIVE ||
      (count === NEIGHBORS_TO_STAY_ALIVE && living.has(cellId(cell)))
    );
  };

  return [...candidates.values()].filter(livesOn);
}
