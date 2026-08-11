export type Cell = [number, number];

const isSameCell = ([x, y]: Cell, [otherX, otherY]: Cell): boolean =>
  x === otherX && y === otherY;

const includesCell = (cells: Cell[], cell: Cell): boolean =>
  cells.some((candidate) => isSameCell(candidate, cell));

const isNeighborOf = (candidate: Cell, cell: Cell): boolean => {
  const [x, y] = cell;
  const [candidateX, candidateY] = candidate;

  return (
    Math.abs(candidateX - x) <= 1 &&
    Math.abs(candidateY - y) <= 1 &&
    !isSameCell(cell, candidate)
  );
};

const countLiveNeighbors = (cell: Cell, liveCells: Cell[]): number =>
  liveCells.filter((candidate) => isNeighborOf(candidate, cell)).length;

const survivesWith = (liveNeighbors: number): boolean =>
  liveNeighbors === 2 || liveNeighbors === 3;

const isBornWith = (liveNeighbors: number): boolean => liveNeighbors === 3;

const deduplicate = (cells: Cell[]): Cell[] =>
  cells.filter(
    (cell, index) => !includesCell(cells.slice(0, index), cell),
  );

const neighborsOf = ([x, y]: Cell): Cell[] =>
  [-1, 0, 1].flatMap((dx) =>
    [-1, 0, 1]
      .filter((dy) => !(dx === 0 && dy === 0))
      .map((dy): Cell => [x + dx, y + dy]),
  );

export function nextGeneration(liveCells: Cell[]): Cell[] {
  const survivors = liveCells.filter((cell) =>
    survivesWith(countLiveNeighbors(cell, liveCells)),
  );

  const deadNeighbors = deduplicate(liveCells.flatMap(neighborsOf)).filter(
    (cell) => !includesCell(liveCells, cell),
  );

  const births = deadNeighbors.filter((cell) =>
    isBornWith(countLiveNeighbors(cell, liveCells)),
  );

  return [...survivors, ...births];
}
