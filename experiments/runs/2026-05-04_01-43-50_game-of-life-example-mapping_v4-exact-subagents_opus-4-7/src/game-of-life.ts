type Cell = [number, number];

const cellKey = (cell: Cell): string => `${cell[0]},${cell[1]}`;

const neighborOffsets: ReadonlyArray<[number, number]> = [
  [-1, -1], [-1, 0], [-1, 1],
  [0, -1],           [0, 1],
  [1, -1],  [1, 0],  [1, 1],
];

const isNeighbor = (cell: Cell, other: Cell): boolean => {
  const [x, y] = cell;
  const [ox, oy] = other;
  return (ox !== x || oy !== y) && Math.abs(ox - x) <= 1 && Math.abs(oy - y) <= 1;
};

const countLiveNeighbors = (cell: Cell, liveCells: Cell[]): number =>
  liveCells.filter((other) => isNeighbor(cell, other)).length;

const isLive = (cell: Cell, liveCells: Cell[]): boolean =>
  liveCells.some(([x, y]) => x === cell[0] && y === cell[1]);

const candidateCells = (liveCells: Cell[]): Cell[] => {
  const seen = new Set<string>();
  const candidates: Cell[] = [];
  for (const [x, y] of liveCells) {
    const neighborhood: Cell[] = [[x, y], ...neighborOffsets.map(([dx, dy]): Cell => [x + dx, y + dy])];
    for (const candidate of neighborhood) {
      const key = cellKey(candidate);
      if (!seen.has(key)) {
        seen.add(key);
        candidates.push(candidate);
      }
    }
  }
  return candidates;
};

const survivesOrIsBorn = (cell: Cell, liveCells: Cell[]): boolean => {
  const liveNeighbors = countLiveNeighbors(cell, liveCells);
  return isLive(cell, liveCells)
    ? liveNeighbors === 2 || liveNeighbors === 3
    : liveNeighbors === 3;
};

export function nextGeneration(cells: Cell[]): Cell[] {
  return candidateCells(cells).filter((cell) => survivesOrIsBorn(cell, cells));
}
