type Cell = [number, number];

const NEIGHBOR_OFFSETS: ReadonlyArray<readonly [number, number]> = [
  [-1, -1], [-1, 0], [-1, 1],
  [ 0, -1],          [ 0, 1],
  [ 1, -1], [ 1, 0], [ 1, 1],
];

const keyOf = (x: number, y: number): string => `${x},${y}`;

const parseKey = (key: string): Cell => {
  const [x, y] = key.split(",");
  return [Number(x), Number(y)];
};

export function nextGeneration(cells: Cell[]): Cell[] {
  const livingKeys = new Set(cells.map(([x, y]) => keyOf(x, y)));
  const neighborCounts = countLiveNeighbors(cells);

  const survivors: Cell[] = [];
  for (const [key, count] of neighborCounts) {
    const isAlive = livingKeys.has(key);
    if (count === 3 || (count === 2 && isAlive)) {
      survivors.push(parseKey(key));
    }
  }
  return survivors;
}

function countLiveNeighbors(cells: Cell[]): Map<string, number> {
  const counts = new Map<string, number>();
  for (const [x, y] of cells) {
    for (const [dx, dy] of NEIGHBOR_OFFSETS) {
      const key = keyOf(x + dx, y + dy);
      counts.set(key, (counts.get(key) ?? 0) + 1);
    }
  }
  return counts;
}
