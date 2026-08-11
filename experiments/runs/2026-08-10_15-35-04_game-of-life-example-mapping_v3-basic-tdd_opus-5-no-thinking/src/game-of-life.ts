export type Cell = [number, number]; // [x, y]

/** A dead cell with exactly this many live neighbors is born. */
const BIRTH_NEIGHBORS = 3;
/** A live cell survives with this many live neighbors, or with BIRTH_NEIGHBORS. */
const SURVIVAL_NEIGHBORS = 2;

const key = ([x, y]: Cell): string => `${x},${y}`;

const parseKey = (k: string): Cell => {
  const [x, y] = k.split(',');
  return [Number(x), Number(y)];
};

const neighbors = ([x, y]: Cell): Cell[] => {
  const result: Cell[] = [];
  for (let dx = -1; dx <= 1; dx++) {
    for (let dy = -1; dy <= 1; dy++) {
      if (dx !== 0 || dy !== 0) result.push([x + dx, y + dy]);
    }
  }
  return result;
};

export function nextGeneration(cells: Cell[]): Cell[] {
  // Deduplicate first: a repeated coordinate is still one cell, and counting it
  // twice would inflate its neighbors' counts.
  const living = new Set(cells.map(key));

  // A cell can only be alive next generation if it is living or adjacent to a
  // living cell, so counting neighbors of living cells covers every candidate.
  const neighborCounts = new Map<string, number>();
  for (const k of living) {
    for (const neighbor of neighbors(parseKey(k))) {
      const k = key(neighbor);
      neighborCounts.set(k, (neighborCounts.get(k) ?? 0) + 1);
    }
  }

  const next: Cell[] = [];
  for (const [k, count] of neighborCounts) {
    const survives = count === SURVIVAL_NEIGHBORS && living.has(k);
    if (count === BIRTH_NEIGHBORS || survives) next.push(parseKey(k));
  }
  return next;
}
