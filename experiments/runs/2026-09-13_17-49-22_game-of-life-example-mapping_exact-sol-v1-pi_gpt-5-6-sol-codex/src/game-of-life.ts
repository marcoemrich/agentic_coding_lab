export type Cell = [number, number];

const MINIMUM_SURVIVAL_NEIGHBORS = 2;
const MAXIMUM_SURVIVAL_NEIGHBORS = 3;
const REPRODUCTION_NEIGHBORS = 3;
const NEIGHBOR_OFFSETS: Cell[] = [
  [-1, -1], [-1, 0], [-1, 1],
  [0, -1], [0, 1],
  [1, -1], [1, 0], [1, 1],
];

function cellKey([x, y]: Cell): string {
  return `${x},${y}`;
}

function countLiveNeighbors([x, y]: Cell, livingCells: Set<string>): number {
  return NEIGHBOR_OFFSETS.filter(([offsetX, offsetY]) =>
    livingCells.has(cellKey([x + offsetX, y + offsetY])),
  ).length;
}

export function nextGeneration(cells: Cell[]): Cell[] {
  const livingCells = new Set(cells.map(cellKey));
  const candidates = new Map<string, Cell>();

  for (const [x, y] of cells) {
    for (const [offsetX, offsetY] of NEIGHBOR_OFFSETS) {
      const candidate: Cell = [x + offsetX, y + offsetY];
      candidates.set(cellKey(candidate), candidate);
    }
  }

  return [...candidates.values()].filter((cell) => {
    const neighborCount = countLiveNeighbors(cell, livingCells);
    const isAlive = livingCells.has(cellKey(cell));
    const survives = isAlive
      && neighborCount >= MINIMUM_SURVIVAL_NEIGHBORS
      && neighborCount <= MAXIMUM_SURVIVAL_NEIGHBORS;
    const reproduces = !isAlive && neighborCount === REPRODUCTION_NEIGHBORS;

    return survives || reproduces;
  });
}
