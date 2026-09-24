export type Cell = [number, number];

function liveNeighborCount(cells: Cell[], cell: Cell): number {
  const neighbors = neighboringPositions(cell);
  return cells.filter(([x, y]) =>
    neighbors.some(([neighborX, neighborY]) => x === neighborX && y === neighborY)
  ).length;
}

function isOverpopulated(neighbors: number): boolean {
  const maximumSurvivalNeighbors = 3;
  return neighbors > maximumSurvivalNeighbors;
}

function survivesWith(neighbors: number): boolean {
  const minimumSurvivalNeighbors = 2;
  return neighbors >= minimumSurvivalNeighbors && !isOverpopulated(neighbors);
}

function isBorn(cells: Cell[], candidate: Cell): boolean {
  const reproductionNeighbors = 3;
  return !cells.some(([x, y]) => x === candidate[0] && y === candidate[1]) &&
    liveNeighborCount(cells, candidate) === reproductionNeighbors;
}

function neighboringPositions([x, y]: Cell): Cell[] {
  const offsets: Cell[] = [
    [-1, -1], [-1, 0], [-1, 1],
    [0, -1], [0, 1],
    [1, -1], [1, 0], [1, 1],
  ];
  return offsets.map(([dx, dy]) => [x + dx, y + dy]);
}

function birthCandidates(cells: Cell[]): Cell[] {
  const candidates = new Map<string, Cell>();
  for (const cell of cells) {
    for (const candidate of neighboringPositions(cell)) {
      candidates.set(JSON.stringify(candidate), candidate);
    }
  }
  return [...candidates.values()];
}

export function nextGeneration(cells: Cell[]): Cell[] {
  const survivors = cells.filter(cell => survivesWith(liveNeighborCount(cells, cell)));
  const births = birthCandidates(cells).filter(candidate => isBorn(cells, candidate));
  return [...survivors, ...births];
}
