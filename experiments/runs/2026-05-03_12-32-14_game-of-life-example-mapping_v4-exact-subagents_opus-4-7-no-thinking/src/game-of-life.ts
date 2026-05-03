// game-of-life.ts

export type Cell = [number, number];

const cellKey = ([x, y]: Cell): string => `${x},${y}`;

const neighborsOf = ([x, y]: Cell): Cell[] => {
  const neighbors: Cell[] = [];
  for (let dx = -1; dx <= 1; dx++) {
    for (let dy = -1; dy <= 1; dy++) {
      if (dx === 0 && dy === 0) continue;
      neighbors.push([x + dx, y + dy]);
    }
  }
  return neighbors;
};

const survivesOrIsBorn = (isAlive: boolean, liveNeighborCount: number): boolean =>
  liveNeighborCount === 3 || (isAlive && liveNeighborCount === 2);

export function nextGeneration(cells: Cell[]): Cell[] {
  const liveSet = new Set(cells.map(cellKey));

  const candidates = new Map<string, Cell>();
  for (const cell of cells) {
    candidates.set(cellKey(cell), cell);
    for (const neighbor of neighborsOf(cell)) {
      candidates.set(cellKey(neighbor), neighbor);
    }
  }

  const nextCells: Cell[] = [];
  for (const [key, cell] of candidates) {
    const liveNeighborCount = neighborsOf(cell).filter((n) => liveSet.has(cellKey(n))).length;
    if (survivesOrIsBorn(liveSet.has(key), liveNeighborCount)) {
      nextCells.push(cell);
    }
  }

  return nextCells;
}
