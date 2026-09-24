export type Cell = [number, number];

const SURVIVAL_NEIGHBORS = 2;
const BIRTH_NEIGHBORS = 3;
const STEPS = [-1, 0, 1];
const OFFSETS = STEPS.flatMap(dx => STEPS
  .filter(dy => dx !== 0 || dy !== 0)
  .map(dy => [dx, dy] as Cell));

const keyOf = ([x, y]: Cell): string => `${x},${y}`;

export function nextGeneration(cells: Cell[]): Cell[] {
  const living = new Set(cells.map(keyOf));
  const neighbors = new Map<string, { cell: Cell; count: number }>();
  const visited = new Set<string>();

  for (const [x, y] of cells) {
    const origin = keyOf([x, y]);
    if (visited.has(origin)) continue;
    visited.add(origin);
    for (const [dx, dy] of OFFSETS) {
      const cell: Cell = [x + dx, y + dy];
      const key = keyOf(cell);
      const entry = neighbors.get(key);
      if (entry) entry.count++;
      else neighbors.set(key, { cell, count: 1 });
    }
  }

  return [...neighbors.entries()]
    .filter(([key, { count }]) => count === BIRTH_NEIGHBORS ||
      (count === SURVIVAL_NEIGHBORS && living.has(key)))
    .map(([, { cell }]) => cell);
}
