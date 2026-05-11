const offsets = [-1, 0, 1];

const neighborKeys = (x: number, y: number): string[] =>
  offsets.flatMap((dx) =>
    offsets
      .filter((dy) => dx !== 0 || dy !== 0)
      .map((dy) => `${x + dx},${y + dy}`)
  );

const countNeighbors = (x: number, y: number, alive: Set<string>): number =>
  neighborKeys(x, y).filter((key) => alive.has(key)).length;

export const nextGeneration = (grid: number[][]): number[][] => {
  const alive = new Set(grid.map(([x, y]) => `${x},${y}`));
  const survivors = grid.filter(([x, y]) => {
    const neighbors = countNeighbors(x, y, alive);
    return neighbors === 2 || neighbors === 3;
  });
  const deadNeighbors = new Set(
    grid.flatMap(([x, y]) => neighborKeys(x, y).filter((key) => !alive.has(key)))
  );
  const births = [...deadNeighbors]
    .map((key) => key.split(",").map(Number))
    .filter(([x, y]) => countNeighbors(x, y, alive) === 3);
  return [...survivors, ...births];
};
