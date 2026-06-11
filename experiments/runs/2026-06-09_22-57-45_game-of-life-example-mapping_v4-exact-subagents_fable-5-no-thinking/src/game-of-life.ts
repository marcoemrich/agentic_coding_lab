export type Cell = [number, number];

const neighborOffsets: Cell[] = [
  [-1, -1],
  [-1, 0],
  [-1, 1],
  [0, -1],
  [0, 1],
  [1, -1],
  [1, 0],
  [1, 1],
];

const neighborsOf = ([x, y]: Cell): Cell[] =>
  neighborOffsets.map(([dx, dy]) => [x + dx, y + dy]);

const isAlive = ([x, y]: Cell, cells: Cell[]): boolean =>
  cells.some(([cellX, cellY]) => cellX === x && cellY === y);

const countLiveNeighbors = (cell: Cell, cells: Cell[]): number =>
  neighborsOf(cell).filter((neighbor) => isAlive(neighbor, cells)).length;

const survives = (liveNeighbors: number): boolean =>
  liveNeighbors === 2 || liveNeighbors === 3;

const unique = (cells: Cell[]): Cell[] => {
  const seen = new Set<string>();
  return cells.filter((cell) => {
    const key = cell.join(",");
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
};

const deadNeighbors = (cells: Cell[]): Cell[] =>
  unique(cells.flatMap(neighborsOf).filter((cell) => !isAlive(cell, cells)));

export const nextGeneration = (cells: Cell[]): Cell[] => {
  const survivors = cells.filter((cell) =>
    survives(countLiveNeighbors(cell, cells))
  );
  const births = deadNeighbors(cells).filter(
    (cell) => countLiveNeighbors(cell, cells) === 3
  );
  return [...survivors, ...births];
};
