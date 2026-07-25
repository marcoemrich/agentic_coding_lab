export type Cell = [number, number];

const NEIGHBOR_OFFSETS = [
  [-1, -1], [0, -1], [1, -1],
  [-1, 0], [1, 0],
  [-1, 1], [0, 1], [1, 1],
] as const;

const cellKey = (x: number, y: number): string => `${x},${y}`;

const countLiveNeighbors = (x: number, y: number, live: Set<string>): number =>
  NEIGHBOR_OFFSETS.filter(([dx, dy]) => live.has(cellKey(x + dx, y + dy))).length;

export function nextGeneration(cells: Cell[]): Cell[] {
  const live = new Set(cells.map(([x, y]) => cellKey(x, y)));

  const survivors = cells.filter(([x, y]) => {
    const liveNeighbors = countLiveNeighbors(x, y, live);
    return liveNeighbors === 2 || liveNeighbors === 3;
  });

  const birthKeys = new Set<string>();
  for (const [x, y] of cells) {
    for (const [dx, dy] of NEIGHBOR_OFFSETS) {
      const nx = x + dx;
      const ny = y + dy;
      const key = cellKey(nx, ny);
      if (live.has(key)) continue;
      if (countLiveNeighbors(nx, ny, live) === 3) birthKeys.add(key);
    }
  }

  const births: Cell[] = [...birthKeys].map((key) => {
    const [x, y] = key.split(",").map(Number);
    return [x, y] as Cell;
  });

  return [...survivors, ...births];
}
