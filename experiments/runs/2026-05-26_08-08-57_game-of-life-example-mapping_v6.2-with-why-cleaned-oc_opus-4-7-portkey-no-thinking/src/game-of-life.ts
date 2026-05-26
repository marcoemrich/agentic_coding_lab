/** A live cell's position on the infinite grid, expressed as [x, y]. */
export type Cell = [number, number];

const NEIGHBOR_OFFSETS: ReadonlyArray<readonly [number, number]> = [
  [-1, -1], [-1, 0], [-1, 1],
  [ 0, -1],          [ 0, 1],
  [ 1, -1], [ 1, 0], [ 1, 1],
];

const cellKey = ([x, y]: Cell): string => `${x},${y}`;

const shouldLive = (wasAlive: boolean, liveNeighbors: number): boolean =>
  wasAlive ? liveNeighbors === 2 || liveNeighbors === 3 : liveNeighbors === 3;

/** Computes the next generation of live cells per Conway's Game of Life rules. */
export function nextGeneration(cells: Cell[]): Cell[] {
  // Tally how many live neighbors each candidate cell has by walking the
  // neighborhood of every live cell and incrementing each neighbor's count.
  const liveNeighborCount = new Map<string, number>();
  const candidates = new Map<string, Cell>();
  for (const [x, y] of cells) {
    for (const [dx, dy] of NEIGHBOR_OFFSETS) {
      const neighbor: Cell = [x + dx, y + dy];
      const key = cellKey(neighbor);
      liveNeighborCount.set(key, (liveNeighborCount.get(key) ?? 0) + 1);
      candidates.set(key, neighbor);
    }
  }

  const liveKeys = new Set(cells.map(cellKey));
  const survivors: Cell[] = [];
  for (const [key, cell] of candidates) {
    if (shouldLive(liveKeys.has(key), liveNeighborCount.get(key) ?? 0)) {
      survivors.push(cell);
    }
  }
  return survivors;
}
