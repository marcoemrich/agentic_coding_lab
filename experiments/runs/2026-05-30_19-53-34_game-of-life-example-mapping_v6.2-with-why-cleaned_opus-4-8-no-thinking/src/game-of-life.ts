type Cell = [number, number]; // [x, y]

const NEIGHBOR_OFFSETS: Cell[] = [
  [-1, -1], [0, -1], [1, -1],
  [-1, 0], [1, 0],
  [-1, 1], [0, 1], [1, 1],
];

const key = (x: number, y: number): string => `${x},${y}`;

const neighborsOf = (x: number, y: number): Cell[] =>
  NEIGHBOR_OFFSETS.map(([dx, dy]) => [x + dx, y + dy]);

export function nextGeneration(cells: Cell[]): Cell[] {
  const liveKeys = new Set(cells.map(([x, y]) => key(x, y)));
  const isAlive = (x: number, y: number): boolean => liveKeys.has(key(x, y));

  const countLiveNeighbors = (x: number, y: number): number =>
    neighborsOf(x, y).filter(([nx, ny]) => isAlive(nx, ny)).length;

  const survivors = cells.filter(([x, y]) => {
    const liveNeighbors = countLiveNeighbors(x, y);
    return liveNeighbors === 2 || liveNeighbors === 3;
  });

  const deadNeighbors = new Map<string, Cell>();
  for (const [x, y] of cells) {
    for (const [nx, ny] of neighborsOf(x, y)) {
      if (!isAlive(nx, ny)) deadNeighbors.set(key(nx, ny), [nx, ny]);
    }
  }
  const births = [...deadNeighbors.values()].filter(
    ([x, y]) => countLiveNeighbors(x, y) === 3,
  );

  return [...survivors, ...births];
}
