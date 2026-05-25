export type Cell = [number, number];

const cellKey = ([x, y]: Cell): string => `${x},${y}`;

const NEIGHBOR_OFFSETS: ReadonlyArray<[number, number]> = [
  [-1, -1], [-1, 0], [-1, 1],
  [0, -1],           [0, 1],
  [1, -1],  [1, 0],  [1, 1],
];

const neighborsOf = ([x, y]: Cell): Cell[] =>
  NEIGHBOR_OFFSETS.map(([dx, dy]) => [x + dx, y + dy]);

const countAliveNeighbors = (
  cell: Cell,
  isAlive: (cell: Cell) => boolean,
): number => neighborsOf(cell).filter(isAlive).length;

const isAliveNextGeneration = (
  currentlyAlive: boolean,
  aliveNeighbors: number,
): boolean =>
  aliveNeighbors === 3 || (aliveNeighbors === 2 && currentlyAlive);

export function nextGeneration(cells: Cell[]): Cell[] {
  const aliveKeys = new Set(cells.map(cellKey));
  const isAlive = (cell: Cell): boolean => aliveKeys.has(cellKey(cell));
  const candidates = new Map<string, Cell>();
  for (const cell of cells) {
    candidates.set(cellKey(cell), cell);
    for (const neighbor of neighborsOf(cell)) {
      candidates.set(cellKey(neighbor), neighbor);
    }
  }
  return [...candidates.values()].filter((cell) =>
    isAliveNextGeneration(isAlive(cell), countAliveNeighbors(cell, isAlive)),
  );
}
