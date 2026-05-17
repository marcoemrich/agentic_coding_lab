export type Cell = [number, number];

const NEIGHBOR_OFFSETS: ReadonlyArray<readonly [number, number]> = [
  [-1, -1], [0, -1], [1, -1],
  [-1, 0], /* self */ [1, 0],
  [-1, 1], [0, 1], [1, 1],
];

const encode = (x: number, y: number): string => `${x},${y}`;

const decode = (key: string): Cell => {
  const [x, y] = key.split(',');
  return [Number(x), Number(y)];
};

function countLiveNeighbors(cells: Cell[]): Map<string, number> {
  const counts = new Map<string, number>();
  for (const [x, y] of cells) {
    for (const [dx, dy] of NEIGHBOR_OFFSETS) {
      const key = encode(x + dx, y + dy);
      counts.set(key, (counts.get(key) ?? 0) + 1);
    }
  }
  return counts;
}

function cellSurvivesOrIsBorn(neighbors: number, isAlive: boolean): boolean {
  return neighbors === 3 || (neighbors === 2 && isAlive);
}

export function nextGeneration(cells: Cell[]): Cell[] {
  const liveCells = new Set(cells.map(([x, y]) => encode(x, y)));
  const neighborCounts = countLiveNeighbors(cells);

  const survivors: Cell[] = [];
  for (const [key, count] of neighborCounts) {
    if (cellSurvivesOrIsBorn(count, liveCells.has(key))) {
      survivors.push(decode(key));
    }
  }
  return survivors;
}
