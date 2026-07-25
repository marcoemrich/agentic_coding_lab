type Cell = [number, number]; // [x, y]

const NEIGHBOR_OFFSETS: Cell[] = [
  [-1, -1], [0, -1], [1, -1],
  [-1, 0], [1, 0],
  [-1, 1], [0, 1], [1, 1],
];

const encode = ([x, y]: Cell): string => `${x},${y}`;
const decode = (key: string): Cell => {
  const [x, y] = key.split(",").map(Number);
  return [x, y];
};

/**
 * Tallies, for every cell adjacent to a living cell, how many living
 * neighbours it has. Cells with zero living neighbours never appear,
 * so the returned map's keys are exactly the candidates for the next
 * generation (living survivors and dead cells that may reproduce).
 */
function countLivingNeighbors(cells: Cell[]): Map<string, number> {
  const neighborCounts = new Map<string, number>();
  for (const [x, y] of cells) {
    for (const [dx, dy] of NEIGHBOR_OFFSETS) {
      const neighborKey = encode([x + dx, y + dy]);
      neighborCounts.set(neighborKey, (neighborCounts.get(neighborKey) ?? 0) + 1);
    }
  }
  return neighborCounts;
}

/**
 * Computes the next generation of Conway's Game of Life on an infinite grid.
 * Uses a sparse representation: only living cells are stored and returned.
 * Each cell is an [x, y] coordinate tuple; negative coordinates are supported.
 */
export function nextGeneration(cells: Cell[]): Cell[] {
  const living = new Set(cells.map(encode));
  const neighborCounts = countLivingNeighbors(cells);

  const result: Cell[] = [];
  for (const [cellKey, neighborCount] of neighborCounts) {
    const cellIsAlive = living.has(cellKey);
    const survives = cellIsAlive && neighborCount === 2;
    const reproduces = neighborCount === 3;
    if (survives || reproduces) {
      result.push(decode(cellKey));
    }
  }
  return result;
}
