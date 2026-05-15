export type Cell = [number, number];

type CellKey = string;

const toKey = ([x, y]: Cell): CellKey => `${x},${y}`;

const fromKey = (key: CellKey): Cell => {
  const [x, y] = key.split(",");
  return [Number(x), Number(y)];
};

const countLiveNeighborsAroundEachCandidate = (
  liveCells: Cell[],
): Map<CellKey, number> => {
  const counts = new Map<CellKey, number>();
  for (const [x, y] of liveCells) {
    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        if (dx === 0 && dy === 0) continue;
        const candidateKey = toKey([x + dx, y + dy]);
        counts.set(candidateKey, (counts.get(candidateKey) ?? 0) + 1);
      }
    }
  }
  return counts;
};

const survives = (isAlive: boolean, liveNeighborCount: number): boolean =>
  isAlive
    ? liveNeighborCount === 2 || liveNeighborCount === 3
    : liveNeighborCount === 3;

export function nextGeneration(cells: Cell[]): Cell[] {
  const liveCellKeys = new Set(cells.map(toKey));
  const neighborCounts = countLiveNeighborsAroundEachCandidate(cells);

  const survivors: Cell[] = [];
  for (const [candidateKey, liveNeighborCount] of neighborCounts) {
    if (survives(liveCellKeys.has(candidateKey), liveNeighborCount)) {
      survivors.push(fromKey(candidateKey));
    }
  }
  return survivors;
}
