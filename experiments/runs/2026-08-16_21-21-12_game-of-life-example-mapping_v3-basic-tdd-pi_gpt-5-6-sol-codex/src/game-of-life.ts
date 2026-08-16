export type Cell = [number, number];

const SURVIVAL_MINIMUM = 2;
const SURVIVAL_MAXIMUM = 3;
const OFFSETS = [-1, 0, 1] as const;

function keyOf(cell: Cell): string {
  return JSON.stringify(cell);
}

function cellOf(key: string): Cell {
  return JSON.parse(key) as Cell;
}

function addNeighborCounts(cell: Cell, counts: Map<string, number>): void {
  for (const dx of OFFSETS) {
    for (const dy of OFFSETS) {
      if (dx === 0 && dy === 0) continue;
      const key = keyOf([cell[0] + dx, cell[1] + dy]);
      counts.set(key, (counts.get(key) ?? 0) + 1);
    }
  }
}

export function nextGeneration(cells: Cell[]): Cell[] {
  const living = new Set(cells.map(keyOf));
  const neighborCounts = new Map<string, number>();
  for (const key of living) addNeighborCounts(cellOf(key), neighborCounts);

  const next: Cell[] = [];
  for (const [key, count] of neighborCounts) {
    const survives = living.has(key) && count === SURVIVAL_MINIMUM;
    if (survives || count === SURVIVAL_MAXIMUM) next.push(cellOf(key));
  }
  return next.sort(([ax, ay], [bx, by]) => ax - bx || ay - by);
}
