export type Cell = [number, number];

const NEIGHBOR_OFFSETS: ReadonlyArray<Cell> = [
  [-1, -1], [-1, 0], [-1, 1],
  [0, -1],           [0, 1],
  [1, -1],  [1, 0],  [1, 1],
];

const SELF_AND_NEIGHBOR_OFFSETS: ReadonlyArray<Cell> = [[0, 0], ...NEIGHBOR_OFFSETS];

const cellKey = (x: number, y: number): string => `${x},${y}`;

const countLiveNeighbors = (
  x: number,
  y: number,
  live: ReadonlySet<string>,
): number =>
  NEIGHBOR_OFFSETS.filter(([dx, dy]) => live.has(cellKey(x + dx, y + dy))).length;

const survivesOrIsBorn = (isAlive: boolean, liveNeighbors: number): boolean =>
  isAlive ? liveNeighbors === 2 || liveNeighbors === 3 : liveNeighbors === 3;

const candidateCells = (liveCells: ReadonlyArray<Cell>): Map<string, Cell> => {
  const candidates = new Map<string, Cell>();
  for (const [x, y] of liveCells) {
    for (const [dx, dy] of SELF_AND_NEIGHBOR_OFFSETS) {
      const nx = x + dx;
      const ny = y + dy;
      candidates.set(cellKey(nx, ny), [nx, ny]);
    }
  }
  return candidates;
};

export function nextGeneration(liveCells: Cell[]): Cell[] {
  const live = new Set(liveCells.map(([x, y]) => cellKey(x, y)));
  const result: Cell[] = [];
  for (const [key, [x, y]] of candidateCells(liveCells)) {
    if (survivesOrIsBorn(live.has(key), countLiveNeighbors(x, y, live))) {
      result.push([x, y]);
    }
  }
  return result;
}
