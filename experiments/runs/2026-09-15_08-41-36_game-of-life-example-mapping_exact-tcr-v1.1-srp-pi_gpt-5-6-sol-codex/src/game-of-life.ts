export type Cell = [number, number];

type CellKey = `${number},${number}`;

const TWO_NEIGHBORS = 2;
const THREE_NEIGHBORS = 3;
const OFFSETS: Cell[] = [-1, 0, 1].flatMap((x) =>
  [-1, 0, 1]
    .filter((y) => x !== 0 || y !== 0)
    .map((y): Cell => [x, y]),
);

function keyOf([x, y]: Cell): CellKey {
  return `${x},${y}`;
}

function cellFrom(key: CellKey): Cell {
  return key.split(",").map(Number) as Cell;
}

function neighborCounts(living: Set<CellKey>): Map<CellKey, number> {
  const counts = new Map<CellKey, number>();
  for (const key of living) {
    const [x, y] = cellFrom(key);
    for (const [dx, dy] of OFFSETS) {
      const neighbor = keyOf([x + dx, y + dy]);
      counts.set(neighbor, (counts.get(neighbor) ?? 0) + 1);
    }
  }
  return counts;
}

export function nextGeneration(cells: Cell[]): Cell[] {
  const living = new Set(cells.map(keyOf));
  const survivors: Cell[] = [];
  for (const [key, count] of neighborCounts(living)) {
    const survives = count === THREE_NEIGHBORS ||
      (count === TWO_NEIGHBORS && living.has(key));
    if (survives) survivors.push(cellFrom(key));
  }
  return survivors;
}
