export type Cell = [number, number];

const NEIGHBOR_OFFSETS: Array<[number, number]> = [
  [-1, -1], [0, -1], [1, -1],
  [-1, 0],           [1, 0],
  [-1, 1],  [0, 1],  [1, 1],
];

const cellKey = ([x, y]: Cell): string => `${x},${y}`;

const survivesOrIsBorn = (neighborCount: number, isAlive: boolean): boolean =>
  neighborCount === 3 || (neighborCount === 2 && isAlive);

const countLiveNeighborsByCell = (liveCells: Array<Cell>): Map<string, { cell: Cell; count: number }> => {
  const tallies = new Map<string, { cell: Cell; count: number }>();
  for (const [x, y] of liveCells) {
    for (const [dx, dy] of NEIGHBOR_OFFSETS) {
      const neighbor: Cell = [x + dx, y + dy];
      const key = cellKey(neighbor);
      const existing = tallies.get(key);
      if (existing) existing.count++;
      else tallies.set(key, { cell: neighbor, count: 1 });
    }
  }
  return tallies;
};

export const nextGeneration = (liveCells: Array<Cell>): Array<Cell> => {
  const liveCellKeys = new Set<string>(liveCells.map(cellKey));
  const neighborTallies = countLiveNeighborsByCell(liveCells);

  const result: Array<Cell> = [];
  for (const [key, { cell, count }] of neighborTallies) {
    if (survivesOrIsBorn(count, liveCellKeys.has(key))) result.push(cell);
  }
  return result;
};
