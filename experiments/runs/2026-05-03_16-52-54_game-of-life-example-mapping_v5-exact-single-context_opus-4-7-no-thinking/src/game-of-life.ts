export type Cell = readonly [number, number];

const NEIGHBOR_OFFSETS: readonly [number, number][] = [
  [-1, -1], [-1, 0], [-1, 1],
  [0, -1],           [0, 1],
  [1, -1],  [1, 0],  [1, 1],
];

const key = (x: number, y: number): string => `${x},${y}`;

export const nextGeneration = (cells: readonly Cell[]): Cell[] => {
  const liveSet = new Set(cells.map(([x, y]) => key(x, y)));
  const liveNeighbors = (x: number, y: number): number =>
    NEIGHBOR_OFFSETS.filter(([dx, dy]) => liveSet.has(key(x + dx, y + dy))).length;

  const candidates = new Map<string, Cell>();
  cells.forEach(([x, y]) => {
    candidates.set(key(x, y), [x, y]);
    NEIGHBOR_OFFSETS.forEach(([dx, dy]) =>
      candidates.set(key(x + dx, y + dy), [x + dx, y + dy]),
    );
  });

  return [...candidates.values()].filter(([x, y]) => {
    const neighborCount = liveNeighbors(x, y);
    const wasAlive = liveSet.has(key(x, y));
    return wasAlive
      ? neighborCount === 2 || neighborCount === 3
      : neighborCount === 3;
  });
};
