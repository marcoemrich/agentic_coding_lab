export type Cell = [x: number, y: number];

const keyOf = ([x, y]: Cell): string => `${x},${y}`;

const neighboursOf = ([x, y]: Cell): Cell[] =>
  [-1, 0, 1].flatMap((dx) =>
    [-1, 0, 1]
      .filter((dy) => dx !== 0 || dy !== 0)
      .map((dy): Cell => [x + dx, y + dy]),
  );

type NeighbourTally = { cell: Cell; livingNeighbours: number };

const countLivingNeighboursPerCell = (livingCells: Cell[]): Map<string, NeighbourTally> => {
  const tallies = new Map<string, NeighbourTally>();
  for (const living of livingCells) {
    for (const neighbour of neighboursOf(living)) {
      const key = keyOf(neighbour);
      const tally = tallies.get(key) ?? { cell: neighbour, livingNeighbours: 0 };
      tallies.set(key, { ...tally, livingNeighbours: tally.livingNeighbours + 1 });
    }
  }
  return tallies;
};

const NEIGHBOURS_FOR_BIRTH = 3;
const NEIGHBOURS_TO_SURVIVE_WHEN_ALIVE = 2;

const isAliveNextGeneration = (livingNeighbours: number, isCurrentlyAlive: boolean): boolean =>
  livingNeighbours === NEIGHBOURS_FOR_BIRTH ||
  (livingNeighbours === NEIGHBOURS_TO_SURVIVE_WHEN_ALIVE && isCurrentlyAlive);

export function nextGeneration(livingCells: Cell[]): Cell[] {
  const livingKeys = new Set(livingCells.map(keyOf));

  return [...countLivingNeighboursPerCell(livingCells)]
    .filter(([key, { livingNeighbours }]) =>
      isAliveNextGeneration(livingNeighbours, livingKeys.has(key)),
    )
    .map(([, { cell }]) => cell);
}
