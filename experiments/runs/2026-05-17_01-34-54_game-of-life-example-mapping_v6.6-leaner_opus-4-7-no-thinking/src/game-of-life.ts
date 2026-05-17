export type Cell = [number, number];

const NEIGHBOR_OFFSETS: ReadonlyArray<[number, number]> = [
  [-1, -1], [-1, 0], [-1, 1],
  [ 0, -1],          [ 0, 1],
  [ 1, -1], [ 1, 0], [ 1, 1],
];

const cellKey = ([x, y]: Cell): string => `${x},${y}`;

const neighborsOf = ([x, y]: Cell): Cell[] =>
  NEIGHBOR_OFFSETS.map(([dx, dy]) => [x + dx, y + dy]);

const survives = (isAlive: boolean, liveNeighbors: number): boolean =>
  liveNeighbors === 3 || (isAlive && liveNeighbors === 2);

export function nextGeneration(cells: Cell[]): Cell[] {
  const alive = new Set(cells.map(cellKey));
  const candidates = new Map<string, Cell>(
    cells.flatMap(cell => [cell, ...neighborsOf(cell)])
         .map(cell => [cellKey(cell), cell])
  );

  return [...candidates.values()].filter(cell => {
    const liveNeighbors = neighborsOf(cell).filter(n => alive.has(cellKey(n))).length;
    return survives(alive.has(cellKey(cell)), liveNeighbors);
  });
}
