export type Cell = [number, number];

const MIN_SURVIVAL_NEIGHBORS = 2;
const THREE_NEIGHBORS = 3;
const NEIGHBOR_OFFSETS: Cell[] = [
  [-1, -1], [0, -1], [1, -1],
  [-1, 0], [1, 0],
  [-1, 1], [0, 1], [1, 1],
];

function cellKey([x, y]: Cell): string {
  return `${x},${y}`;
}

function neighboringCells([x, y]: Cell): Cell[] {
  return NEIGHBOR_OFFSETS.map(([dx, dy]) => [x + dx, y + dy]);
}

function countLiveNeighbors(cell: Cell, livingCells: Set<string>): number {
  return neighboringCells(cell).filter((neighbor) => livingCells.has(cellKey(neighbor))).length;
}

function findBirths(cells: Cell[], livingCells: Set<string>): Cell[] {
  const candidates = new Map<string, Cell>();
  for (const cell of cells) {
    for (const neighbor of neighboringCells(cell)) {
      candidates.set(cellKey(neighbor), neighbor);
    }
  }
  return [...candidates.values()].filter((cell) =>
    !livingCells.has(cellKey(cell)) && countLiveNeighbors(cell, livingCells) === THREE_NEIGHBORS
  );
}

export function nextGeneration(cells: Cell[]): Cell[] {
  const livingCells = new Set(cells.map(cellKey));
  const survivors = cells.filter((cell) => {
    const neighbors = countLiveNeighbors(cell, livingCells);
    return neighbors >= MIN_SURVIVAL_NEIGHBORS && neighbors <= THREE_NEIGHBORS;
  });
  return [...survivors, ...findBirths(cells, livingCells)];
}
