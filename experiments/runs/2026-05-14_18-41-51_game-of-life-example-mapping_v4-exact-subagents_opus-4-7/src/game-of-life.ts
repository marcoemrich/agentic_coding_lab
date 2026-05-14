export type Cell = [number, number];

const NEIGHBOR_OFFSETS: ReadonlyArray<[number, number]> = [
  [-1, -1], [-1, 0], [-1, 1],
  [0, -1],           [0, 1],
  [1, -1],  [1, 0],  [1, 1],
];

const keyOf = (x: number, y: number): string => `${x},${y}`;

const neighborsOf = (x: number, y: number): Cell[] =>
  NEIGHBOR_OFFSETS.map(([dx, dy]) => [x + dx, y + dy]);

export const nextGeneration = (cells: Cell[]): Cell[] => {
  const liveCells = new Set(cells.map(([x, y]) => keyOf(x, y)));
  const isAlive = (x: number, y: number): boolean => liveCells.has(keyOf(x, y));

  const countLiveNeighbors = (x: number, y: number): number =>
    neighborsOf(x, y).filter(([nx, ny]) => isAlive(nx, ny)).length;

  const candidates = new Map<string, Cell>();
  for (const [x, y] of cells) {
    for (const [cx, cy] of [[x, y] as Cell, ...neighborsOf(x, y)]) {
      candidates.set(keyOf(cx, cy), [cx, cy]);
    }
  }

  return [...candidates.values()].filter(([x, y]) => {
    const liveNeighbors = countLiveNeighbors(x, y);
    return isAlive(x, y) ? liveNeighbors === 2 || liveNeighbors === 3 : liveNeighbors === 3;
  });
};
