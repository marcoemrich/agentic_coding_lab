type Cell = [number, number];

const cellKey = ([x, y]: Cell): string => `${x},${y}`;

const NEIGHBOR_OFFSETS: ReadonlyArray<[number, number]> = [
  [-1, -1], [-1, 0], [-1, 1],
  [ 0, -1],          [ 0, 1],
  [ 1, -1], [ 1, 0], [ 1, 1],
];

const neighborsOf = ([x, y]: Cell): Cell[] =>
  NEIGHBOR_OFFSETS.map(([dx, dy]) => [x + dx, y + dy]);

const survives = (neighborCount: number): boolean =>
  neighborCount === 2 || neighborCount === 3;

const reproduces = (neighborCount: number): boolean => neighborCount === 3;

export function nextGeneration(cells: Cell[]): Cell[] {
  const liveKeys = new Set(cells.map(cellKey));
  const countLiveNeighbors = (cell: Cell): number =>
    neighborsOf(cell).filter((n) => liveKeys.has(cellKey(n))).length;

  const candidates = new Map<string, Cell>();
  for (const cell of cells) {
    candidates.set(cellKey(cell), cell);
    for (const neighbor of neighborsOf(cell)) {
      candidates.set(cellKey(neighbor), neighbor);
    }
  }

  return [...candidates.values()].filter((cell) => {
    const count = countLiveNeighbors(cell);
    return liveKeys.has(cellKey(cell)) ? survives(count) : reproduces(count);
  });
}
