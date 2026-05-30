export function nextGeneration(cells: [number, number][]): [number, number][] {
  const isAlive = (x: number, y: number): boolean =>
    cells.some(([cx, cy]) => cx === x && cy === y);

  const neighborsOf = (x: number, y: number): [number, number][] =>
    [
      [-1, -1], [-1, 0], [-1, 1],
      [0, -1], [0, 1],
      [1, -1], [1, 0], [1, 1],
    ].map(([dx, dy]) => [x + dx, y + dy]);

  const countLiveNeighbors = (x: number, y: number): number =>
    neighborsOf(x, y).filter(([nx, ny]) => isAlive(nx, ny)).length;

  const survivors = cells.filter(([x, y]) => {
    const liveNeighbors = countLiveNeighbors(x, y);
    return liveNeighbors === 2 || liveNeighbors === 3;
  });

  const birthCandidates = new Map<string, [number, number]>();
  for (const [x, y] of cells) {
    for (const [nx, ny] of neighborsOf(x, y)) {
      if (!isAlive(nx, ny)) {
        birthCandidates.set(`${nx},${ny}`, [nx, ny]);
      }
    }
  }

  const births = [...birthCandidates.values()].filter(
    ([x, y]) => countLiveNeighbors(x, y) === 3
  );

  return [...survivors, ...births];
}
