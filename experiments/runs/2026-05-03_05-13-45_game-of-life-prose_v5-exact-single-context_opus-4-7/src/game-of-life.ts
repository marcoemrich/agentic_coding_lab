const NEIGHBOR_OFFSETS: ReadonlyArray<[number, number]> = [
  [-1, -1], [-1, 0], [-1, 1],
  [0, -1],           [0, 1],
  [1, -1],  [1, 0],  [1, 1],
];

export const nextGeneration = (living: Set<string>): Set<string> => {
  const neighborCounts = new Map<string, number>();
  for (const cell of living) {
    const [x, y] = cell.split(",").map(Number);
    for (const [dx, dy] of NEIGHBOR_OFFSETS) {
      const key = `${x + dx},${y + dy}`;
      neighborCounts.set(key, (neighborCounts.get(key) ?? 0) + 1);
    }
  }
  const next = new Set<string>();
  for (const [cell, count] of neighborCounts) {
    const becomesAlive = count === 3;
    const survives = count === 2 && living.has(cell);
    if (becomesAlive || survives) {
      next.add(cell);
    }
  }
  return next;
};
