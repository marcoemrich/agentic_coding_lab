export type Cell = [number, number];

const neighbors = ([x, y]: Cell): Cell[] => [
  [x - 1, y - 1], [x, y - 1], [x + 1, y - 1],
  [x - 1, y],                  [x + 1, y],
  [x - 1, y + 1], [x, y + 1], [x + 1, y + 1],
];

const countLiveNeighbors = (cell: Cell, alive: Set<string>): number =>
  neighbors(cell).filter(([nx, ny]) => alive.has(`${nx},${ny}`)).length;

export const nextGeneration = (cells: Cell[]): Cell[] => {
  const alive = new Set(cells.map(([x, y]) => `${x},${y}`));
  const candidates = new Set<string>();
  for (const cell of cells) {
    candidates.add(`${cell[0]},${cell[1]}`);
    for (const [nx, ny] of neighbors(cell)) candidates.add(`${nx},${ny}`);
  }
  const next: Cell[] = [];
  for (const key of candidates) {
    const [x, y] = key.split(",").map(Number) as [number, number];
    const cell: Cell = [x, y];
    const n = countLiveNeighbors(cell, alive);
    if (alive.has(key) ? n === 2 || n === 3 : n === 3) next.push(cell);
  }
  return next.sort(([ax, ay], [bx, by]) => ax !== bx ? ax - bx : ay - by);
};
