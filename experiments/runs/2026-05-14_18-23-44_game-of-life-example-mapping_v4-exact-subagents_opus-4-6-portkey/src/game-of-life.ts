export type Cell = [number, number];

const isNeighbor = (cell: Cell, other: Cell): boolean =>
  !(cell[0] === other[0] && cell[1] === other[1]) &&
  Math.abs(cell[0] - other[0]) <= 1 &&
  Math.abs(cell[1] - other[1]) <= 1;

const countNeighbors = (cell: Cell, cells: Cell[]): number =>
  cells.filter((other) => isNeighbor(cell, other)).length;

const deadNeighbors = (cells: Cell[]): Cell[] => {
  const alive = new Set(cells.map(([x, y]) => `${x},${y}`));
  const candidates = new Set<string>();
  for (const [x, y] of cells) {
    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        if (dx === 0 && dy === 0) continue;
        const key = `${x + dx},${y + dy}`;
        if (!alive.has(key)) candidates.add(key);
      }
    }
  }
  return [...candidates].map((k) => k.split(",").map(Number) as unknown as Cell);
};

export function nextGeneration(cells: Cell[]): Cell[] {
  const survives = (cell: Cell) => {
    const n = countNeighbors(cell, cells);
    return n === 2 || n === 3;
  };
  const reproduces = (cell: Cell) => countNeighbors(cell, cells) === 3;
  const survivors = cells.filter(survives);
  const born = deadNeighbors(cells).filter(reproduces);
  return [...survivors, ...born];
}
