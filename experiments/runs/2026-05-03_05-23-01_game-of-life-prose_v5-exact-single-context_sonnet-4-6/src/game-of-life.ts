// Cell is encoded as "x,y" (e.g. "0,0", "-1,3")
type Cell = string;

const neighbors = (cell: Cell): Cell[] => {
  const [x, y] = cell.split(",").map(Number);
  return [
    `${x-1},${y-1}`, `${x},${y-1}`, `${x+1},${y-1}`,
    `${x-1},${y}`,                   `${x+1},${y}`,
    `${x-1},${y+1}`, `${x},${y+1}`, `${x+1},${y+1}`,
  ];
};

const livesOn = (cell: Cell, count: number, cells: Set<Cell>): boolean =>
  count === 3 || (count === 2 && cells.has(cell));

export const nextGeneration = (cells: Set<Cell>): Set<Cell> => {
  const neighborCounts = new Map<Cell, number>();
  for (const cell of cells) {
    for (const neighbor of neighbors(cell)) {
      neighborCounts.set(neighbor, (neighborCounts.get(neighbor) ?? 0) + 1);
    }
  }
  const nextCells = new Set<Cell>();
  for (const [cell, count] of neighborCounts) {
    if (livesOn(cell, count, cells)) {
      nextCells.add(cell);
    }
  }
  return nextCells;
};
