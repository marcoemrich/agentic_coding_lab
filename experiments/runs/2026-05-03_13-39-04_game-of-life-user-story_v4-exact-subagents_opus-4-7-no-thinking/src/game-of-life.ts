const NEIGHBOR_OFFSETS: ReadonlyArray<readonly [number, number]> = [
  [-1, -1], [-1, 0], [-1, 1],
  [ 0, -1],          [ 0, 1],
  [ 1, -1], [ 1, 0], [ 1, 1],
];

const willBeAlive = (neighborCount: number, isCurrentlyAlive: boolean): boolean =>
  neighborCount === 3 || (neighborCount === 2 && isCurrentlyAlive);

const countNeighborsForCandidates = (livingCells: Set<string>): Map<string, number> => {
  const counts = new Map<string, number>();
  for (const livingCell of livingCells) {
    const [x, y] = livingCell.split(",").map(Number);
    for (const [dx, dy] of NEIGHBOR_OFFSETS) {
      const candidateKey = `${x + dx},${y + dy}`;
      counts.set(candidateKey, (counts.get(candidateKey) ?? 0) + 1);
    }
  }
  return counts;
};

export function nextGeneration(livingCells: Set<string>): Set<string> {
  const neighborCounts = countNeighborsForCandidates(livingCells);
  const nextLivingCells = new Set<string>();
  for (const [candidate, neighborCount] of neighborCounts) {
    if (willBeAlive(neighborCount, livingCells.has(candidate))) {
      nextLivingCells.add(candidate);
    }
  }
  return nextLivingCells;
}
