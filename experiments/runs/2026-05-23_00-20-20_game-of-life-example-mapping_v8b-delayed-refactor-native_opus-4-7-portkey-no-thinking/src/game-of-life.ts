export type Cell = [number, number];

type CellKey = string;

const NEIGHBOR_OFFSETS: ReadonlyArray<readonly [number, number]> = [
  [-1, -1], [0, -1], [1, -1],
  [-1,  0],          [1,  0],
  [-1,  1], [0,  1], [1,  1],
];

const toKey = ([x, y]: Cell): CellKey => `${x},${y}`;

const fromKey = (key: CellKey): Cell => {
  const comma = key.indexOf(",");
  return [Number(key.slice(0, comma)), Number(key.slice(comma + 1))];
};

function countNeighborsAround(cells: Cell[]): Map<CellKey, number> {
  const counts = new Map<CellKey, number>();
  for (const [x, y] of cells) {
    for (const [dx, dy] of NEIGHBOR_OFFSETS) {
      const key = toKey([x + dx, y + dy]);
      counts.set(key, (counts.get(key) ?? 0) + 1);
    }
  }
  return counts;
}

function survives(neighborCount: number, isAlive: boolean): boolean {
  return neighborCount === 3 || (neighborCount === 2 && isAlive);
}

export function nextGeneration(cells: Cell[]): Cell[] {
  const liveCells = new Set(cells.map(toKey));
  const neighborCounts = countNeighborsAround(cells);

  const next: Cell[] = [];
  for (const [key, count] of neighborCounts) {
    if (survives(count, liveCells.has(key))) {
      next.push(fromKey(key));
    }
  }
  return next;
}
