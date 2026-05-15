type Cell = [number, number];

const cellKey = (x: number, y: number): string => `${x},${y}`;

const parseCellKey = (key: string): Cell => {
  const [xStr, yStr] = key.split(",");
  return [Number(xStr), Number(yStr)];
};

const neighborOffsets: ReadonlyArray<Cell> = [
  [-1, -1], [-1, 0], [-1, 1],
  [ 0, -1],          [ 0, 1],
  [ 1, -1], [ 1, 0], [ 1, 1],
];

const neighborsOf = (x: number, y: number): Cell[] =>
  neighborOffsets.map(([dx, dy]) => [x + dx, y + dy]);

const isAlive = (cell: Cell, liveSet: Set<string>): boolean =>
  liveSet.has(cellKey(cell[0], cell[1]));

const countLiveNeighbors = (cell: Cell, liveSet: Set<string>): number =>
  neighborsOf(cell[0], cell[1]).filter((neighbor) => isAlive(neighbor, liveSet)).length;

const willBeAlive = (isCurrentlyAlive: boolean, liveNeighbors: number): boolean =>
  isCurrentlyAlive ? liveNeighbors === 2 || liveNeighbors === 3 : liveNeighbors === 3;

const candidateKeysFor = (liveCells: Array<Cell>): Set<string> => {
  const candidates = new Set<string>();
  for (const [x, y] of liveCells) {
    candidates.add(cellKey(x, y));
    for (const [nx, ny] of neighborsOf(x, y)) {
      candidates.add(cellKey(nx, ny));
    }
  }
  return candidates;
};

export const nextGeneration = (liveCells: Array<Cell>): Array<Cell> => {
  const liveSet = new Set(liveCells.map(([x, y]) => cellKey(x, y)));

  return Array.from(candidateKeysFor(liveCells))
    .map(parseCellKey)
    .filter((cell) => willBeAlive(isAlive(cell, liveSet), countLiveNeighbors(cell, liveSet)));
};

