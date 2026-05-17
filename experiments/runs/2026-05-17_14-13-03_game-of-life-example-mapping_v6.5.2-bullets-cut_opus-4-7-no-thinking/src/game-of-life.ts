export type Cell = [number, number];

const NEIGHBOR_OFFSETS: Cell[] = [
  [-1, -1], [-1, 0], [-1, 1],
  [0, -1],           [0, 1],
  [1, -1],  [1, 0],  [1, 1],
];

const keyOf = ([x, y]: Cell): string => `${x},${y}`;

const neighborsOf = ([x, y]: Cell): Cell[] =>
  NEIGHBOR_OFFSETS.map(([dx, dy]) => [x + dx, y + dy]);

const survivesOrIsBorn = (liveNeighbors: number, wasAlive: boolean): boolean =>
  liveNeighbors === 3 || (liveNeighbors === 2 && wasAlive);

export function nextGeneration(liveCells: Cell[]): Cell[] {
  const liveSet = new Set(liveCells.map(keyOf));
  const candidates = new Map<string, Cell>();
  for (const live of liveCells) {
    candidates.set(keyOf(live), live);
    for (const neighbor of neighborsOf(live)) {
      candidates.set(keyOf(neighbor), neighbor);
    }
  }
  return [...candidates.values()].filter((cell) => {
    const liveNeighbors = neighborsOf(cell).filter((n) => liveSet.has(keyOf(n))).length;
    return survivesOrIsBorn(liveNeighbors, liveSet.has(keyOf(cell)));
  });
}
