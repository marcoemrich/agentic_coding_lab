const toKey = (x: number, y: number): string => `${x},${y}`;
const fromKey = (key: string): number[] => key.split(",").map(Number);

function nextGeneration(alive: number[][]): number[][] {
  const livingSet = new Set(alive.map(([x, y]) => toKey(x, y)));
  const neighborCounts = new Map<string, number>();

  for (const [x, y] of alive) {
    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        if (dx === 0 && dy === 0) continue;
        const key = toKey(x + dx, y + dy);
        neighborCounts.set(key, (neighborCounts.get(key) ?? 0) + 1);
      }
    }
  }

  const result: number[][] = [];
  for (const [key, count] of neighborCounts) {
    if (count === 3 || (count === 2 && livingSet.has(key))) {
      result.push(fromKey(key));
    }
  }

  return result;
}

export const simulate = (aliveCells: number[][], steps: number): number[][] => {
  let cells = aliveCells;
  for (let i = 0; i < steps; i++) {
    cells = nextGeneration(cells);
  }
  return [...cells].sort((a, b) => a[0] - b[0] || a[1] - b[1]);
};
