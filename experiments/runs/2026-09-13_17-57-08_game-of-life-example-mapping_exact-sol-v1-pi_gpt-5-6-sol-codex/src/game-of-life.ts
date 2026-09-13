export type Cell = [number, number];

type CellKey = string;

const SURVIVAL_MINIMUM = 2;
const REPRODUCTION_COUNT = 3;
const NEIGHBOR_OFFSETS: Cell[] = [
  [-1, -1], [0, -1], [1, -1],
  [-1, 0], [1, 0],
  [-1, 1], [0, 1], [1, 1],
];

const encode = ([x, y]: Cell): CellKey => `${x},${y}`;

const decode = (key: CellKey): Cell => {
  const [x, y] = key.split(",").map(Number);
  return [x, y];
};

const countNeighbors = (cells: Cell[]): Map<CellKey, number> => {
  const counts = new Map<CellKey, number>();
  for (const [x, y] of cells) {
    for (const [offsetX, offsetY] of NEIGHBOR_OFFSETS) {
      const neighbor = encode([x + offsetX, y + offsetY]);
      counts.set(neighbor, (counts.get(neighbor) ?? 0) + 1);
    }
  }
  return counts;
};

export function nextGeneration(cells: Cell[]): Cell[] {
  const living = new Set(cells.map(encode));
  return [...countNeighbors(cells)]
    .filter(([cell, count]) => count === REPRODUCTION_COUNT
      || (count === SURVIVAL_MINIMUM && living.has(cell)))
    .map(([cell]) => decode(cell));
}
