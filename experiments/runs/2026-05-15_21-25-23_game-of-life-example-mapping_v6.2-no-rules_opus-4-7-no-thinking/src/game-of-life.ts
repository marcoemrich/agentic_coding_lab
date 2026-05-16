export type Cell = [number, number];

const NEIGHBOR_OFFSETS: ReadonlyArray<Cell> = [
  [-1, -1], [-1, 0], [-1, 1],
  [ 0, -1],          [ 0, 1],
  [ 1, -1], [ 1, 0], [ 1, 1],
];

const keyOf = ([x, y]: Cell): string => `${x},${y}`;

const countLiveNeighbors = (cell: Cell, alive: ReadonlySet<string>): number => {
  const [x, y] = cell;
  return NEIGHBOR_OFFSETS.filter(([dx, dy]) => alive.has(keyOf([x + dx, y + dy]))).length;
};

const livesNextGeneration = (isAlive: boolean, liveNeighbors: number): boolean =>
  liveNeighbors === 3 || (isAlive && liveNeighbors === 2);

export function nextGeneration(cells: Cell[]): Cell[] {
  const alive = new Set(cells.map(keyOf));
  const candidates = new Map<string, Cell>();
  for (const [x, y] of cells) {
    candidates.set(keyOf([x, y]), [x, y]);
    for (const [dx, dy] of NEIGHBOR_OFFSETS) {
      const neighbor: Cell = [x + dx, y + dy];
      candidates.set(keyOf(neighbor), neighbor);
    }
  }
  return [...candidates.values()].filter((cell) =>
    livesNextGeneration(alive.has(keyOf(cell)), countLiveNeighbors(cell, alive)),
  );
}
