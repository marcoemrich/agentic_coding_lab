export type Cell = [number, number];

const isNeighbor = (a: Cell, b: Cell): boolean => {
  const dx = Math.abs(a[0] - b[0]);
  const dy = Math.abs(a[1] - b[1]);
  return (dx !== 0 || dy !== 0) && dx <= 1 && dy <= 1;
};

const countLiveNeighbors = (cell: Cell, cells: Cell[]): number =>
  cells.filter((other) => isNeighbor(cell, other)).length;

const survives = (liveNeighbors: number): boolean =>
  liveNeighbors === 2 || liveNeighbors === 3;

const reproduces = (liveNeighbors: number): boolean => liveNeighbors === 3;

const key = (cell: Cell): string => `${cell[0]},${cell[1]}`;

const neighborOffsets: Cell[] = [
  [-1, -1], [0, -1], [1, -1],
  [-1, 0], [1, 0],
  [-1, 1], [0, 1], [1, 1],
];

const deadNeighborCandidates = (cells: Cell[]): Cell[] => {
  const live = new Set(cells.map(key));
  const candidates = cells.flatMap(([x, y]): Cell[] =>
    neighborOffsets.map(([dx, dy]) => [x + dx, y + dy]),
  );
  const deadByKey = new Map<string, Cell>(
    candidates
      .filter((cell) => !live.has(key(cell)))
      .map((cell) => [key(cell), cell]),
  );
  return [...deadByKey.values()];
};

export const nextGeneration = (cells: Cell[]): Cell[] => {
  const survivors = cells.filter((cell) =>
    survives(countLiveNeighbors(cell, cells)),
  );
  const born = deadNeighborCandidates(cells).filter((cell) =>
    reproduces(countLiveNeighbors(cell, cells)),
  );
  return [...survivors, ...born];
};
