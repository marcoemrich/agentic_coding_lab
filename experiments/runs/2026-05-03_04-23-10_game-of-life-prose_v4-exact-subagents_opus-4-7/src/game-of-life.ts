const NEIGHBOR_OFFSETS: ReadonlyArray<[number, number]> = [
  [-1, -1], [-1, 0], [-1, 1],
  [0, -1],           [0, 1],
  [1, -1],  [1, 0],  [1, 1],
];

const toKey = (x: number, y: number): string => `${x},${y}`;

const parseKey = (key: string): [number, number] => {
  const [x, y] = key.split(",").map(Number);
  return [x, y];
};

const neighborsOf = (cell: string): string[] => {
  const [x, y] = parseKey(cell);
  return NEIGHBOR_OFFSETS.map(([dx, dy]) => toKey(x + dx, y + dy));
};

const cellsToEvaluate = (liveCells: Set<string>): Set<string> =>
  new Set([...liveCells, ...[...liveCells].flatMap(neighborsOf)]);

export const nextGeneration = (liveCells: Set<string>): Set<string> => {
  const countLiveNeighbors = (cell: string): number =>
    neighborsOf(cell).filter((neighbor) => liveCells.has(neighbor)).length;

  const survives = (cell: string): boolean => {
    const liveNeighborCount = countLiveNeighbors(cell);
    return liveNeighborCount === 3 || (liveNeighborCount === 2 && liveCells.has(cell));
  };

  return new Set([...cellsToEvaluate(liveCells)].filter(survives));
};
