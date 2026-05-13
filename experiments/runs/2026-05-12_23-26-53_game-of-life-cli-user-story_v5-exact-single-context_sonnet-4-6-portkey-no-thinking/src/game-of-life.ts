export const step = (aliveCells: [number, number][], steps: number): [number, number][] => {
  if (steps === 0) return aliveCells;
  if (steps > 1) return step(step(aliveCells, 1), steps - 1);

  const aliveSet = new Set(aliveCells.map(([x, y]) => `${x},${y}`));

  const neighborCount = new Map<string, number>();
  for (const [x, y] of aliveCells) {
    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        if (dx === 0 && dy === 0) continue;
        const cellKey = `${x + dx},${y + dy}`;
        neighborCount.set(cellKey, (neighborCount.get(cellKey) ?? 0) + 1);
      }
    }
  }

  const nextGeneration: [number, number][] = [];
  for (const [cellKey, count] of neighborCount) {
    const isAlive = aliveSet.has(cellKey);
    const [x, y] = cellKey.split(",").map(Number) as [number, number];
    if (count === 3 || (count === 2 && isAlive)) {
      nextGeneration.push([x, y]);
    }
  }

  const byXThenY = ([ax, ay]: [number, number], [bx, by]: [number, number]) =>
    ax !== bx ? ax - bx : ay - by;
  return nextGeneration.sort(byXThenY);
};
