const cellKey = (x: number, y: number): string => `${x},${y}`;

const neighborKeys = (x: number, y: number): string[] => {
  const keys: string[] = [];
  for (let dx = -1; dx <= 1; dx++) {
    for (let dy = -1; dy <= 1; dy++) {
      if (dx === 0 && dy === 0) continue;
      keys.push(cellKey(x + dx, y + dy));
    }
  }
  return keys;
};

const countLiveNeighbors = (x: number, y: number, aliveSet: Set<string>): number =>
  neighborKeys(x, y).filter(key => aliveSet.has(key)).length;

const stepOnce = (aliveCells: number[][]): number[][] => {
  const aliveSet = new Set(aliveCells.map(([x, y]) => cellKey(x, y)));

  const survivors = aliveCells.filter(([x, y]) => {
    const neighbors = countLiveNeighbors(x, y, aliveSet);
    return neighbors === 2 || neighbors === 3;
  });

  const deadCandidates = new Set<string>();
  for (const [x, y] of aliveCells) {
    for (const key of neighborKeys(x, y)) {
      if (!aliveSet.has(key)) deadCandidates.add(key);
    }
  }

  const born = [...deadCandidates]
    .map(key => key.split(",").map(Number))
    .filter(([x, y]) => countLiveNeighbors(x, y, aliveSet) === 3);

  return [...survivors, ...born];
};

export const advanceGameOfLife = (aliveCells: number[][], steps: number): number[][] => {
  let current = aliveCells;
  for (let step = 0; step < steps; step++) {
    current = stepOnce(current);
  }
  return [...current].sort((a, b) => a[0] - b[0] || a[1] - b[1]);
};
