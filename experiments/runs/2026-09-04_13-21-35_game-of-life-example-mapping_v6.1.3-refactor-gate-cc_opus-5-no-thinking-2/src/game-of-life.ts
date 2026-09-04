export type Cell = [number, number];

const NEIGHBOUR_OFFSETS: Cell[] = [
  [-1, -1], [0, -1], [1, -1],
  [-1, 0], [1, 0],
  [-1, 1], [0, 1], [1, 1],
];

const key = ([x, y]: Cell): string => `${x},${y}`;

const neighboursOf = ([x, y]: Cell): Cell[] =>
  NEIGHBOUR_OFFSETS.map(([dx, dy]): Cell => [x + dx, y + dy]);

// A cell's fate depends only on itself and its neighbours, so the only cells
// that can be alive next generation are the live ones and those adjacent to them.
const candidatesFor = (cells: Cell[]): Cell[] => {
  const seen = new Set<string>();
  return cells
    .flatMap((cell) => [cell, ...neighboursOf(cell)])
    .filter((cell) => {
      const k = key(cell);
      if (seen.has(k)) return false;
      seen.add(k);
      return true;
    });
};

const survives = (liveNeighbours: number): boolean =>
  liveNeighbours === 2 || liveNeighbours === 3;

const reproduces = (liveNeighbours: number): boolean => liveNeighbours === 3;

export function nextGeneration(cells: Cell[]): Cell[] {
  const liveKeys = new Set(cells.map(key));
  const isAlive = (cell: Cell): boolean => liveKeys.has(key(cell));
  const liveNeighbourCount = (cell: Cell): number =>
    neighboursOf(cell).filter(isAlive).length;

  return candidatesFor(cells).filter((cell) =>
    isAlive(cell)
      ? survives(liveNeighbourCount(cell))
      : reproduces(liveNeighbourCount(cell)),
  );
}
