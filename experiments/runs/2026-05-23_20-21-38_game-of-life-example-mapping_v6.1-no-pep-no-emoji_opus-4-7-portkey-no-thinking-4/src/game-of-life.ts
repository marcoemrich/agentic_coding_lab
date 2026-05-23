export type Cell = [number, number];

const key = (x: number, y: number): string => `${x},${y}`;

const NEIGHBOR_OFFSETS: ReadonlyArray<Cell> = [
  [-1, -1], [-1, 0], [-1, 1],
  [ 0, -1],          [ 0, 1],
  [ 1, -1], [ 1, 0], [ 1, 1],
];

function countLiveNeighbors(x: number, y: number, liveCells: Set<string>): number {
  return NEIGHBOR_OFFSETS.filter(([dx, dy]) => liveCells.has(key(x + dx, y + dy))).length;
}

export function nextGeneration(cells: Cell[]): Cell[] {
  const liveCells = new Set(cells.map(([x, y]) => key(x, y)));
  const candidates = new Map<string, Cell>();
  for (const [x, y] of cells) {
    candidates.set(key(x, y), [x, y]);
    for (const [dx, dy] of NEIGHBOR_OFFSETS) {
      candidates.set(key(x + dx, y + dy), [x + dx, y + dy]);
    }
  }
  const result: Cell[] = [];
  for (const [k, cell] of candidates) {
    const liveNeighbors = countLiveNeighbors(cell[0], cell[1], liveCells);
    const isAlive = liveCells.has(k);
    if (liveNeighbors === 3 || (isAlive && liveNeighbors === 2)) {
      result.push(cell);
    }
  }
  return result;
}
