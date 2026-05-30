export type Cell = [number, number];

const SURVIVAL_NEIGHBORS = 2;
const BIRTH_NEIGHBORS = 3;

const cellKey = ([x, y]: Cell): string => `${x},${y}`;

const neighborOffsets: ReadonlyArray<Cell> = [
  [-1, -1], [-1, 0], [-1, 1],
  [0, -1],           [0, 1],
  [1, -1],  [1, 0],  [1, 1],
];

type NeighborTally = { cell: Cell; count: number };

function* neighborsOf([x, y]: Cell): Iterable<Cell> {
  for (const [dx, dy] of neighborOffsets) yield [x + dx, y + dy];
}

function tallyNeighbors(cells: Cell[]): Map<string, NeighborTally> {
  const tallies = new Map<string, NeighborTally>();
  for (const cell of cells) {
    for (const neighbor of neighborsOf(cell)) {
      const key = cellKey(neighbor);
      const tally = tallies.get(key) ?? { cell: neighbor, count: 0 };
      tally.count += 1;
      tallies.set(key, tally);
    }
  }
  return tallies;
}

function isAliveNextGeneration(neighborCount: number, isAlive: boolean): boolean {
  if (neighborCount === BIRTH_NEIGHBORS) return true;
  return neighborCount === SURVIVAL_NEIGHBORS && isAlive;
}

export function nextGeneration(cells: Cell[]): Cell[] {
  const alive = new Set(cells.map(cellKey));
  const tallies = tallyNeighbors(cells);
  return Array.from(tallies.values())
    .filter(({ cell, count }) => isAliveNextGeneration(count, alive.has(cellKey(cell))))
    .map(({ cell }) => cell);
}
