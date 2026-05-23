export type Cell = [number, number];

const cellKey = ([x, y]: Cell): string => `${x},${y}`;

const NEIGHBOR_OFFSETS: Cell[] = [
  [-1, -1], [-1, 0], [-1, 1],
  [ 0, -1],          [ 0, 1],
  [ 1, -1], [ 1, 0], [ 1, 1],
];

const neighborsOf = ([x, y]: Cell): Cell[] =>
  NEIGHBOR_OFFSETS.map(([dx, dy]) => [x + dx, y + dy]);

const survivesOrBorn = (isAlive: boolean, neighbors: number): boolean =>
  isAlive ? neighbors === 2 || neighbors === 3 : neighbors === 3;

type Candidate = { cell: Cell; liveNeighbors: number };

const collectCandidates = (liveCells: Cell[]): Map<string, Candidate> => {
  const candidates = new Map<string, Candidate>();
  for (const cell of liveCells) {
    for (const neighbor of neighborsOf(cell)) {
      const key = cellKey(neighbor);
      const prior = candidates.get(key) ?? { cell: neighbor, liveNeighbors: 0 };
      candidates.set(key, { cell: prior.cell, liveNeighbors: prior.liveNeighbors + 1 });
    }
  }
  return candidates;
};

export function nextGeneration(cells: Cell[]): Cell[] {
  const liveKeys = new Set(cells.map(cellKey));
  const candidates = collectCandidates(cells);

  const result: Cell[] = [];
  for (const [key, { cell, liveNeighbors }] of candidates) {
    if (survivesOrBorn(liveKeys.has(key), liveNeighbors)) {
      result.push(cell);
    }
  }
  return result;
}
