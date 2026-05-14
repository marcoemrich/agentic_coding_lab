const neighborsOf = (x: number, y: number): [number, number][] => {
  const result: [number, number][] = [];
  for (let dx = -1; dx <= 1; dx++) {
    for (let dy = -1; dy <= 1; dy++) {
      if (dx === 0 && dy === 0) continue;
      result.push([x + dx, y + dy]);
    }
  }
  return result;
};

const countLiveNeighbors = (x: number, y: number, alive: Set<string>): number =>
  neighborsOf(x, y).filter(([nx, ny]) => alive.has(`${nx},${ny}`)).length;

export const nextGeneration = (liveCells: number[][]): number[][] => {
  const alive = new Set(liveCells.map(([x, y]) => `${x},${y}`));

  const survivors = liveCells.filter(([x, y]) => {
    const neighbors = countLiveNeighbors(x, y, alive);
    return neighbors >= 2 && neighbors <= 3;
  });

  const deadCandidates = new Set<string>();
  for (const [x, y] of liveCells) {
    for (const [nx, ny] of neighborsOf(x, y)) {
      const key = `${nx},${ny}`;
      if (!alive.has(key)) deadCandidates.add(key);
    }
  }

  const born: number[][] = [];
  for (const key of deadCandidates) {
    const [x, y] = key.split(",").map(Number);
    if (countLiveNeighbors(x, y, alive) === 3) {
      born.push([x, y]);
    }
  }

  return [...survivors, ...born];
};
