export type Cell = [number, number];

const cellsEqual = (a: Cell, b: Cell): boolean => a[0] === b[0] && a[1] === b[1];

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

const countLiveNeighbors = (cell: Cell, liveCells: Cell[]): number =>
  neighborsOf(cell).filter((neighbor) => liveCells.some((live) => cellsEqual(live, neighbor))).length;

const isLive = (cell: Cell, liveCells: Cell[]): boolean =>
  liveCells.some((live) => cellsEqual(live, cell));

const uniqueCells = (cells: Cell[]): Cell[] =>
  cells.filter((cell, index) => cells.findIndex((other) => cellsEqual(other, cell)) === index);

const survivesToNextGeneration = (cell: Cell, liveCells: Cell[]): boolean => {
  const liveNeighborCount = countLiveNeighbors(cell, liveCells);
  return liveNeighborCount === 3 || (liveNeighborCount === 2 && isLive(cell, liveCells));
};

export const nextGeneration = (liveCells: Cell[]): Cell[] => {
  const candidates = uniqueCells([...liveCells, ...liveCells.flatMap(neighborsOf)]);
  return candidates.filter((cell) => survivesToNextGeneration(cell, liveCells));
};
