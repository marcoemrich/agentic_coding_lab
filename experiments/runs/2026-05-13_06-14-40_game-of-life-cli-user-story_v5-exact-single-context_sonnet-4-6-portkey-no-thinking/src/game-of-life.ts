export type Cell = [number, number];

const neighborOffsets: Cell[] = [
  [-1, -1], [-1, 0], [-1, 1],
  [0, -1],           [0, 1],
  [1, -1],  [1, 0],  [1, 1],
];

const cellKey = ([x, y]: Cell): string => `${x},${y}`;

const byPosition = ([ax, ay]: Cell, [bx, by]: Cell): number =>
  ax !== bx ? ax - bx : ay - by;

const livesOn = (isAlive: boolean, count: number): boolean =>
  isAlive ? count === 2 || count === 3 : count === 3;

const nextGeneration = (cells: Cell[]): Cell[] => {
  const neighborCounts = new Map<string, number>();

  for (const [x, y] of cells) {
    for (const [dx, dy] of neighborOffsets) {
      const key = cellKey([x + dx, y + dy]);
      neighborCounts.set(key, (neighborCounts.get(key) ?? 0) + 1);
    }
  }

  const alive = new Set(cells.map(cellKey));
  const nextCells: Cell[] = [];

  for (const [key, count] of neighborCounts) {
    const [x, y] = key.split(",").map(Number) as Cell;
    if (livesOn(alive.has(key), count)) {
      nextCells.push([x, y]);
    }
  }

  return nextCells.sort(byPosition);
};

export const step = (cells: Cell[], numSteps: number): Cell[] => {
  if (numSteps === 0) return [...cells].sort(byPosition);
  let current = cells;
  for (let i = 0; i < numSteps; i++) {
    current = nextGeneration(current);
  }
  return current;
};
