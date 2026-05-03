type Cell = [number, number];

const areNeighbors = (a: Cell, b: Cell): boolean => {
  const [ax, ay] = a;
  const [bx, by] = b;
  if (ax === bx && ay === by) return false;
  return Math.abs(ax - bx) <= 1 && Math.abs(ay - by) <= 1;
};

const countLiveNeighbors = (cell: Cell, liveCells: Cell[]): number =>
  liveCells.filter((other) => areNeighbors(cell, other)).length;

const survives = (liveNeighbors: number): boolean =>
  liveNeighbors === 2 || liveNeighbors === 3;

const isLive = ([x, y]: Cell, liveCells: Cell[]): boolean =>
  liveCells.some(([lx, ly]) => lx === x && ly === y);

const NEIGHBOR_OFFSETS: Cell[] = [
  [-1, -1], [-1, 0], [-1, 1],
  [ 0, -1],          [ 0, 1],
  [ 1, -1], [ 1, 0], [ 1, 1],
];

const neighborsOf = ([x, y]: Cell): Cell[] =>
  NEIGHBOR_OFFSETS.map(([dx, dy]) => [x + dx, y + dy]);

const cellKey = ([x, y]: Cell): string => `${x},${y}`;

const uniqueCells = (cells: Cell[]): Cell[] => {
  const seen = new Map<string, Cell>();
  cells.forEach((cell) => seen.set(cellKey(cell), cell));
  return [...seen.values()];
};

const deadNeighborCandidates = (liveCells: Cell[]): Cell[] =>
  uniqueCells(liveCells.flatMap(neighborsOf)).filter(
    (cell) => !isLive(cell, liveCells),
  );

export const nextGeneration = (cells: Cell[]): Cell[] => {
  const survivors = cells.filter((cell) =>
    survives(countLiveNeighbors(cell, cells)),
  );
  const reborn = deadNeighborCandidates(cells).filter(
    (cell) => countLiveNeighbors(cell, cells) === 3,
  );
  return [...survivors, ...reborn];
};
