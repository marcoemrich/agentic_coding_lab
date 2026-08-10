export type Cell = [number, number];

const OFFSETS = [-1, 0, 1] as const;
const NEIGHBOR_OFFSETS: Cell[] = OFFSETS.flatMap((dx) =>
  OFFSETS.map((dy) => [dx, dy] as Cell),
).filter(([dx, dy]) => dx !== 0 || dy !== 0);
const REQUIRED_FOR_BIRTH = 3;
const REQUIRED_FOR_SURVIVAL = 2;

const keyOf = ([x, y]: Cell): string => `${x},${y}`;

function uniqueCells(cells: Cell[]): Map<string, Cell> {
  return new Map(cells.map((cell) => [keyOf(cell), cell]));
}

function countNeighbours(living: Map<string, Cell>): Map<string, number> {
  const counts = new Map<string, number>();
  for (const [x, y] of living.values()) {
    for (const [dx, dy] of NEIGHBOR_OFFSETS) {
      const key = keyOf([x + dx, y + dy]);
      counts.set(key, (counts.get(key) ?? 0) + 1);
    }
  }
  return counts;
}

export function nextGeneration(cells: Cell[]): Cell[] {
  const living = uniqueCells(cells);
  const counts = countNeighbours(living);
  const next: Cell[] = [];

  for (const [key, neighbours] of counts) {
    const survives = neighbours === REQUIRED_FOR_SURVIVAL && living.has(key);
    if (neighbours === REQUIRED_FOR_BIRTH || survives) {
      next.push(key.split(',').map(Number) as Cell);
    }
  }

  return next.sort(([ax, ay], [bx, by]) => ay - by || ax - bx);
}
