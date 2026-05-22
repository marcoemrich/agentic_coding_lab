export type Cell = [number, number];

const NEIGHBOR_OFFSETS: ReadonlyArray<readonly [number, number]> = [
  [-1, -1], [-1, 0], [-1, 1],
  [ 0, -1],          [ 0, 1],
  [ 1, -1], [ 1, 0], [ 1, 1],
];

const cellKey = (x: number, y: number): string => `${x},${y}`;

export function nextGeneration(cells: Cell[]): Cell[] {
  const liveSet = new Set(cells.map(([x, y]) => cellKey(x, y)));
  const neighborCounts = countLiveNeighbors(cells);

  const survivors: Cell[] = cells.filter(([x, y]) => {
    const count = neighborCounts.get(cellKey(x, y)) ?? 0;
    return count === 2 || count === 3;
  });

  const births: Cell[] = [];
  for (const [k, count] of neighborCounts) {
    if (count === 3 && !liveSet.has(k)) {
      births.push(parseCellKey(k));
    }
  }

  return [...survivors, ...births];
}

function countLiveNeighbors(cells: Cell[]): Map<string, number> {
  const counts = new Map<string, number>();
  for (const [x, y] of cells) {
    for (const [dx, dy] of NEIGHBOR_OFFSETS) {
      const k = cellKey(x + dx, y + dy);
      counts.set(k, (counts.get(k) ?? 0) + 1);
    }
  }
  return counts;
}

function parseCellKey(key: string): Cell {
  const [x, y] = key.split(",").map(Number);
  return [x, y];
}
