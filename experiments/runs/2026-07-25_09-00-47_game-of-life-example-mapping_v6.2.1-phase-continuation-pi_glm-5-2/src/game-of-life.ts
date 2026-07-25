export type Cell = [number, number];

// The eight offsets from a cell to its surrounding neighbors (Moore neighborhood).
const NEIGHBOR_OFFSETS: Array<[number, number]> = [
  [-1, -1], [0, -1], [1, -1],
  [-1, 0],           [1, 0],
  [-1, 1],  [0, 1],  [1, 1],
];

// Game of Life rule thresholds for live-neighbor counts.
const REPRODUCTION_NEIGHBORS = 3; // dead cell with this many live neighbors is born
const SURVIVAL_NEIGHBORS = 2;     // live cell with this many (or 3) live neighbors survives

const key = (x: number, y: number): string => `${x},${y}`;

export function nextGeneration(cells: Cell[]): Cell[] {
  const liveCells = new Set(cells.map(([x, y]) => key(x, y)));

  // Tally the live-neighbor count for every position adjacent to a live cell.
  const liveNeighborCount = new Map<string, number>();
  for (const [x, y] of cells) {
    for (const [dx, dy] of NEIGHBOR_OFFSETS) {
      const neighborKey = key(x + dx, y + dy);
      liveNeighborCount.set(neighborKey, (liveNeighborCount.get(neighborKey) ?? 0) + 1);
    }
  }

  // A position is alive next generation when it has 3 live neighbors
  // (birth or survival) or 2 live neighbors and is currently alive (survival).
  const nextCells: Cell[] = [];
  for (const [position, count] of liveNeighborCount) {
    const becomesAlive =
      count === REPRODUCTION_NEIGHBORS ||
      (count === SURVIVAL_NEIGHBORS && liveCells.has(position));
    if (becomesAlive) {
      const [x, y] = position.split(",").map(Number);
      nextCells.push([x, y] as Cell);
    }
  }
  return nextCells;
}
