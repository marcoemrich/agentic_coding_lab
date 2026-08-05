export type Cell = [x: number, y: number];

const keyOf = ([x, y]: Cell): string => `${x},${y}`;

const NEIGHBOUR_OFFSETS: Cell[] = [
  [-1, -1],
  [0, -1],
  [1, -1],
  [-1, 0],
  [1, 0],
  [-1, 1],
  [0, 1],
  [1, 1],
];

const neighboursOf = ([x, y]: Cell): Cell[] =>
  NEIGHBOUR_OFFSETS.map(([dx, dy]): Cell => [x + dx, y + dy]);

type NeighbourCount = { cell: Cell; key: string; livingNeighbours: number };

const countLivingNeighboursPerCell = (
  livingCells: Cell[],
): NeighbourCount[] => {
  const counts = new Map<string, NeighbourCount>();
  for (const living of livingCells) {
    for (const neighbour of neighboursOf(living)) {
      const key = keyOf(neighbour);
      const livingNeighbours = (counts.get(key)?.livingNeighbours ?? 0) + 1;
      counts.set(key, { cell: neighbour, key, livingNeighbours });
    }
  }
  return [...counts.values()];
};

const livesOn = (livingNeighbours: number, isAlive: boolean): boolean =>
  livingNeighbours === 3 || (livingNeighbours === 2 && isAlive);

export function nextGeneration(livingCells: Cell[]): Cell[] {
  const alive = new Set(livingCells.map(keyOf));
  return countLivingNeighboursPerCell(livingCells)
    .filter(({ key, livingNeighbours }) =>
      livesOn(livingNeighbours, alive.has(key)),
    )
    .map(({ cell }) => cell);
}
