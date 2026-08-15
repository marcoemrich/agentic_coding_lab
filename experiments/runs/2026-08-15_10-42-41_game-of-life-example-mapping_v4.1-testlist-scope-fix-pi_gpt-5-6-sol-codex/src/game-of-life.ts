export type Cell = [number, number];

const toCellKey = ([x, y]: Cell): string => `${x},${y}`;

export function nextGeneration(liveCells: Cell[]): Cell[] {
  const liveCellKeys = new Set(liveCells.map(toCellKey));
  const neighborCounts = new Map<string, { cell: Cell; count: number }>();

  for (const [x, y] of liveCells) {
    for (let yOffset = -1; yOffset <= 1; yOffset++) {
      for (let xOffset = -1; xOffset <= 1; xOffset++) {
        if (xOffset === 0 && yOffset === 0) continue;

        const neighbor: Cell = [x + xOffset, y + yOffset];
        const neighborKey = toCellKey(neighbor);
        const countedNeighbor = neighborCounts.get(neighborKey) ?? {
          cell: neighbor,
          count: 0,
        };
        countedNeighbor.count++;
        neighborCounts.set(neighborKey, countedNeighbor);
      }
    }
  }

  return [...neighborCounts.entries()]
    .filter(
      ([cellKey, { count: liveNeighborCount }]) =>
        liveNeighborCount === 3 ||
        (liveNeighborCount === 2 && liveCellKeys.has(cellKey)),
    )
    .map(([, { cell }]) => cell)
    .sort(([xA, yA], [xB, yB]) => yA - yB || xA - xB);
}
