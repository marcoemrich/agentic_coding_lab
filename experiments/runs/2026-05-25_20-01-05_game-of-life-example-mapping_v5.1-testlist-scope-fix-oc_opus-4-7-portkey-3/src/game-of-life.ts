export type Cell = [number, number];

const NEIGHBOR_OFFSETS: ReadonlyArray<[number, number]> = [
  [-1, -1], [0, -1], [1, -1],
  [-1,  0],          [1,  0],
  [-1,  1], [0,  1], [1,  1],
];

const cellKey = (x: number, y: number): string => `${x},${y}`;

export function nextGeneration(cells: Cell[]): Cell[] {
  const liveCells = new Set(cells.map(([x, y]) => cellKey(x, y)));

  const isAlive = (x: number, y: number): boolean =>
    liveCells.has(cellKey(x, y));

  const countLiveNeighbors = (x: number, y: number): number =>
    NEIGHBOR_OFFSETS.filter(([dx, dy]) => isAlive(x + dx, y + dy)).length;

  const survives = (x: number, y: number): boolean => {
    const n = countLiveNeighbors(x, y);
    return isAlive(x, y) ? n === 2 || n === 3 : n === 3;
  };

  return candidateCells(cells).filter(([x, y]) => survives(x, y));
}

function candidateCells(cells: Cell[]): Cell[] {
  const seen = new Set<string>();
  const candidates: Cell[] = [];
  const offsetsWithSelf: ReadonlyArray<[number, number]> = [[0, 0], ...NEIGHBOR_OFFSETS];
  for (const [x, y] of cells) {
    for (const [dx, dy] of offsetsWithSelf) {
      const cx = x + dx;
      const cy = y + dy;
      const key = cellKey(cx, cy);
      if (!seen.has(key)) {
        seen.add(key);
        candidates.push([cx, cy]);
      }
    }
  }
  return candidates;
}
