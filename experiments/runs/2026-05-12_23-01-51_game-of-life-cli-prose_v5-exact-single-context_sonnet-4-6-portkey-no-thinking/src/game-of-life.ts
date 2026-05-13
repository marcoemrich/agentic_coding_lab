export type Cell = [number, number];

const key = (x: number, y: number): string => `${x},${y}`;

const neighbors = (x: number, y: number): Cell[] => [
  [x-1,y-1],[x,y-1],[x+1,y-1],
  [x-1,y],          [x+1,y],
  [x-1,y+1],[x,y+1],[x+1,y+1],
];

const step = (cells: Cell[]): Cell[] => {
  const alive = new Set(cells.map(([x,y]) => key(x,y)));
  const counts = new Map<string, number>();
  const candidates = new Map<string, Cell>();

  for (const [x, y] of cells) {
    for (const neighbor of neighbors(x, y)) {
      const k = key(neighbor[0], neighbor[1]);
      counts.set(k, (counts.get(k) ?? 0) + 1);
      candidates.set(k, neighbor);
    }
  }

  const next: Cell[] = [];
  for (const [k, count] of counts) {
    if (count === 3 || (count === 2 && alive.has(k))) {
      next.push(candidates.get(k)!);
    }
  }
  return next.sort(byXthenY);
};

const byXthenY = ([ax,ay]: Cell, [bx,by]: Cell): number =>
  ax !== bx ? ax - bx : ay - by;

const sortCells = (cells: Cell[]): Cell[] =>
  cells.slice().sort(byXthenY);

export const nextGeneration = (cells: Cell[], steps: number): Cell[] => {
  if (steps === 0) return sortCells(cells);
  let current = cells;
  for (let i = 0; i < steps; i++) current = step(current);
  return current;
};
