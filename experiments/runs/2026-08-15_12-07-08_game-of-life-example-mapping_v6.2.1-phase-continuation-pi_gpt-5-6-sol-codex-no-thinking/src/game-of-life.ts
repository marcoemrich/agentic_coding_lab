export type Cell = [number, number];

const SURVIVAL_NEIGHBOR_COUNT = 2;
const REPRODUCTION_NEIGHBOR_COUNT = 3;

const keyOf = (x: number, y: number): string => `${x},${y}`;

function* neighborsOf([x, y]: Cell): Generator<Cell> {
  for (let deltaY = -1; deltaY <= 1; deltaY += 1) {
    for (let deltaX = -1; deltaX <= 1; deltaX += 1) {
      if (deltaX !== 0 || deltaY !== 0) {
        yield [x + deltaX, y + deltaY];
      }
    }
  }
}

export function nextGeneration(liveCells: Cell[]): Cell[] {
  const living = new Set(liveCells.map(([x, y]) => keyOf(x, y)));
  const neighborCounts = new Map<string, { cell: Cell; count: number }>();

  for (const liveCell of liveCells) {
    for (const cell of neighborsOf(liveCell)) {
      const key = keyOf(...cell);
      const current = neighborCounts.get(key);
      neighborCounts.set(key, { cell, count: (current?.count ?? 0) + 1 });
    }
  }

  return [...neighborCounts.entries()]
    .filter(([key, { count }]) =>
      count === REPRODUCTION_NEIGHBOR_COUNT
      || (count === SURVIVAL_NEIGHBOR_COUNT && living.has(key)))
    .map(([, { cell }]) => cell)
    .sort(([xA, yA], [xB, yB]) => yA - yB || xA - xB);
}
