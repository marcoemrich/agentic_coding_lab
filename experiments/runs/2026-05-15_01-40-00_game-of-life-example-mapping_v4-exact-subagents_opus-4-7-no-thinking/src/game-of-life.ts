type Cell = [number, number];

const neighborOffsets: Array<Cell> = [
  [-1, -1], [0, -1], [1, -1],
  [-1, 0],           [1, 0],
  [-1, 1],  [0, 1],  [1, 1],
];

const cellKey = (x: number, y: number): string => `${x},${y}`;

const survives = (currentlyAlive: boolean, liveNeighborCount: number): boolean =>
  (currentlyAlive && liveNeighborCount === 2) || liveNeighborCount === 3;

export const nextGeneration = (liveCells: Array<Cell>): Array<Cell> => {
  const liveSet = new Set(liveCells.map(([x, y]) => cellKey(x, y)));
  const isAlive = (x: number, y: number): boolean => liveSet.has(cellKey(x, y));

  const countLiveNeighbors = (x: number, y: number): number =>
    neighborOffsets.reduce(
      (count, [dx, dy]) => count + (isAlive(x + dx, y + dy) ? 1 : 0),
      0,
    );

  const candidates = new Map<string, Cell>();
  for (const [x, y] of liveCells) {
    candidates.set(cellKey(x, y), [x, y]);
    for (const [dx, dy] of neighborOffsets) {
      const nx = x + dx;
      const ny = y + dy;
      candidates.set(cellKey(nx, ny), [nx, ny]);
    }
  }

  return [...candidates.values()].filter(([x, y]) =>
    survives(isAlive(x, y), countLiveNeighbors(x, y)),
  );
};
