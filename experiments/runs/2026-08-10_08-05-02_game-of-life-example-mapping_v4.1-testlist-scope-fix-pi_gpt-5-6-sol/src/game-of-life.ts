export type Cell = [number, number];

export function advanceGenerations(liveCells: Cell[], generations: number): Cell[] {
  let currentGeneration = liveCells;

  for (let generation = 0; generation < generations; generation++) {
    currentGeneration = nextGeneration(currentGeneration);
  }

  return currentGeneration;
}

export function nextGeneration(liveCells: Cell[]): Cell[] {
  const liveCellKeys = new Set(liveCells.map(([x, y]) => `${x},${y}`));
  const neighborCounts = new Map<string, { cell: Cell; count: number }>();

  for (const [x, y] of liveCells) {
    for (let yOffset = -1; yOffset <= 1; yOffset++) {
      for (let xOffset = -1; xOffset <= 1; xOffset++) {
        if (xOffset === 0 && yOffset === 0) continue;

        const neighbor: Cell = [x + xOffset, y + yOffset];
        const key = `${neighbor[0]},${neighbor[1]}`;
        const candidate = neighborCounts.get(key);
        neighborCounts.set(key, {
          cell: neighbor,
          count: (candidate?.count ?? 0) + 1,
        });
      }
    }
  }

  return [...neighborCounts.entries()]
    .filter(([key, { count }]) => count === 3 || (count === 2 && liveCellKeys.has(key)))
    .map(([, { cell }]) => cell)
    .sort(([xA, yA], [xB, yB]) => yA - yB || xA - xB);
}
