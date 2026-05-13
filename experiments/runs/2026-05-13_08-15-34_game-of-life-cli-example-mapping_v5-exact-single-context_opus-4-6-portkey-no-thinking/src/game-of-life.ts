function countLiveNeighbors(x: number, y: number, alive: Set<string>): number {
  let count = 0;
  for (let dx = -1; dx <= 1; dx++) {
    for (let dy = -1; dy <= 1; dy++) {
      if (dx === 0 && dy === 0) continue;
      if (alive.has(`${x + dx},${y + dy}`)) count++;
    }
  }
  return count;
}

export const nextGeneration = (liveCells: [number, number][]): [number, number][] => {
  const alive = new Set(liveCells.map(([x, y]) => `${x},${y}`));

  const survivors = liveCells.filter(([x, y]) => {
    const n = countLiveNeighbors(x, y, alive);
    return n === 2 || n === 3;
  });

  const deadCandidates = new Set<string>();
  for (const [x, y] of liveCells) {
    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        if (dx === 0 && dy === 0) continue;
        const key = `${x + dx},${y + dy}`;
        if (!alive.has(key)) deadCandidates.add(key);
      }
    }
  }

  const born: [number, number][] = [];
  for (const key of deadCandidates) {
    const [x, y] = key.split(",").map(Number) as [number, number];
    if (countLiveNeighbors(x, y, alive) === 3) born.push([x, y]);
  }

  return [...survivors, ...born];
};
