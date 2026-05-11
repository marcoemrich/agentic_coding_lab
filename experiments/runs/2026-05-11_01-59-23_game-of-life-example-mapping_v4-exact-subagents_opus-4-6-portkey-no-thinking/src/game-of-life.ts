const toKey = (x: number, y: number): string => `${x},${y}`;
const fromKey = (key: string): [number, number] => {
  const [x, y] = key.split(",").map(Number);
  return [x, y];
};

const neighborOffsets = [
  [-1, -1], [-1, 0], [-1, 1],
  [0, -1],           [0, 1],
  [1, -1],  [1, 0],  [1, 1],
];

export const nextGeneration = (liveCells: number[][]): number[][] => {
  if (liveCells.length === 0) return [];

  const alive = new Set(liveCells.map(([x, y]) => toKey(x, y)));

  const countNeighbors = (x: number, y: number): number =>
    neighborOffsets.filter(([dx, dy]) => alive.has(toKey(x + dx, y + dy))).length;

  const candidates = new Set<string>();
  for (const [x, y] of liveCells) {
    candidates.add(toKey(x, y));
    for (const [dx, dy] of neighborOffsets) {
      candidates.add(toKey(x + dx, y + dy));
    }
  }

  const result: number[][] = [];
  for (const key of candidates) {
    const [x, y] = fromKey(key);
    const neighbors = countNeighbors(x, y);
    if (neighbors === 3 || (neighbors === 2 && alive.has(key))) {
      result.push([x, y]);
    }
  }

  return result;
};
