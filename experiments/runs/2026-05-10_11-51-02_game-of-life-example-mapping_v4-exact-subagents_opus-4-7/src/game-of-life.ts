export type Cell = [number, number];

const NEIGHBOR_OFFSETS: ReadonlyArray<readonly [number, number]> = [
  [-1, -1], [-1, 0], [-1, 1],
  [ 0, -1],          [ 0, 1],
  [ 1, -1], [ 1, 0], [ 1, 1],
];

const keyOf = ([x, y]: Cell): string => `${x},${y}`;

const neighborsOf = ([x, y]: Cell): Cell[] =>
  NEIGHBOR_OFFSETS.map(([dx, dy]) => [x + dx, y + dy]);

const survives = (isAlive: boolean, liveNeighbors: number): boolean =>
  liveNeighbors === 3 || (isAlive && liveNeighbors === 2);

export const nextGeneration = (cells: Cell[]): Cell[] => {
  const liveKeys = new Set<string>(cells.map(keyOf));

  const candidates = new Map<string, Cell>();
  for (const cell of cells) {
    candidates.set(keyOf(cell), cell);
    for (const neighbor of neighborsOf(cell)) {
      candidates.set(keyOf(neighbor), neighbor);
    }
  }

  const countLiveNeighbors = (cell: Cell): number =>
    neighborsOf(cell).reduce(
      (count, neighbor) => count + (liveKeys.has(keyOf(neighbor)) ? 1 : 0),
      0,
    );

  const result: Cell[] = [];
  for (const [key, cell] of candidates) {
    if (survives(liveKeys.has(key), countLiveNeighbors(cell))) {
      result.push(cell);
    }
  }
  return result;
};
