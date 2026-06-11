// game-of-life.ts
export type Cell = [number, number];

const NEIGHBORHOOD_OFFSETS = [-1, 0, 1];

const cellKey = ([x, y]: Cell): string => `${x},${y}`;

const neighborhoodOf = ([x, y]: Cell): Cell[] =>
  NEIGHBORHOOD_OFFSETS.flatMap((dx) =>
    NEIGHBORHOOD_OFFSETS.map((dy): Cell => [x + dx, y + dy])
  );

const neighborsOf = (cell: Cell): Cell[] =>
  neighborhoodOf(cell).filter((other) => cellKey(other) !== cellKey(cell));

export const nextGeneration = (liveCells: Cell[]): Cell[] => {
  const liveKeys = new Set(liveCells.map(cellKey));
  const isAlive = (cell: Cell): boolean => liveKeys.has(cellKey(cell));

  const livesInNextGeneration = (cell: Cell): boolean => {
    const liveNeighbors = neighborsOf(cell).filter(isAlive).length;
    return liveNeighbors === 3 || (liveNeighbors === 2 && isAlive(cell));
  };

  const candidates = new Map(
    liveCells
      .flatMap(neighborhoodOf)
      .map((cell): [string, Cell] => [cellKey(cell), cell])
  );

  return [...candidates.values()].filter(livesInNextGeneration);
};
