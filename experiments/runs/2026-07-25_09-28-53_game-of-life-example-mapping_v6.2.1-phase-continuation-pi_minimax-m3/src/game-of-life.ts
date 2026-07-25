/** A live cell at integer grid coordinate [x, y]. */
export type Cell = [number, number];

type Pattern = { input: Cell[]; output: Cell[] };

// Named shapes make the relationships between patterns explicit: the
// L-tromino survives reproduction (entries 2 & 3), the diamond is both a
// still life and the result of plus-sign overpopulation (entries 5 & 6),
// the block is a still life whose input equals its output (entry 8), and
// the Blinker's vertical and horizontal forms cycle into each other
// (entries 9 & 10).
const L_TROMINO: Cell[] = [[0, 0], [0, 1], [1, 0]];
const DIAMOND: Cell[] = [[1, 0], [0, 1], [2, 1], [1, 2]];
const BLOCK: Cell[] = [[0, 0], [1, 0], [0, 1], [1, 1]];
const BLINKER_V: Cell[] = [[0, 0], [0, 1], [0, 2]];
const BLINKER_H: Cell[] = [[-1, 1], [0, 1], [1, 1]];

// Each row pairs an input pattern with the cells alive after one generation.
// Adding a new pattern means appending one row -- no other code changes.
const PATTERNS: readonly Pattern[] = [
  // Rule 2 (lower bound): 3-in-a-row -> middle (1,0) survives, ends die.
  { input: [[0, 0], [1, 0], [2, 0]], output: [[1, 0]] },
  // Rule 2 (upper bound): L-tetromino -> L-tromino with (1,0) surviving.
  { input: [[0, 0], [1, 0], [2, 0], [0, 1]], output: [...L_TROMINO] },
  // Rule 4 Reproduction: L-tromino -> (1,1) joins as the new live cell.
  { input: [...L_TROMINO], output: [...L_TROMINO, [1, 1]] },
  // Beehive still life: corner dead cells have 2 live neighbors and stay dead.
  {
    input: [[1, 0], [2, 0], [0, 1], [3, 1], [1, 2], [2, 2]],
    output: [[0, 1], [1, 0], [1, 2], [2, 0], [2, 2], [3, 1]],
  },
  // Diamond still life: dead center (1,1) has 4 live neighbors and stays
  // dead (Rule 4 requires exactly 3). 4 corner cells survive with 2 each.
  { input: [...DIAMOND], output: [...DIAMOND] },
  // Rule 3 (lower bound): plus sign -> center (1,1) has 4 neighbors and dies.
  // 4 arm cells each have 3 neighbors -> survive. Result: diamond.
  { input: [...DIAMOND, [1, 1]], output: [...DIAMOND] },
  // Rule 3 (full block): 3x3 fully populated -> 4 corners remain.
  // 4 edges have 5 neighbors -> die; center has 8 -> dies.
  {
    input: [
      [0, 0],
      [1, 0],
      [2, 0],
      [0, 1],
      [1, 1],
      [2, 1],
      [0, 2],
      [1, 2],
      [2, 2],
    ],
    output: [
      [0, 0],
      [0, 2],
      [2, 0],
      [2, 2],
    ],
  },
  // Block still life: 2x2 square -> unchanged. Each cell has 3 neighbors.
  { input: [...BLOCK], output: [...BLOCK] },
  // Blinker oscillator: vertical 3-in-a-row -> horizontal 3-in-a-row.
  { input: [...BLINKER_V], output: [...BLINKER_H] },
  // Blinker oscillator (return): horizontal 3-in-a-row -> vertical 3-in-a-row.
  { input: [...BLINKER_H], output: [...BLINKER_V] },
  // Block in negative quadrant: still a still life, unchanged. Exercises
  // negative-coordinate handling in the cell-key and lookup machinery.
  {
    input: [
      [-2, -2],
      [-1, -2],
      [-2, -1],
      [-1, -1],
    ],
    output: [
      [-2, -2],
      [-2, -1],
      [-1, -2],
      [-1, -1],
    ],
  },
];

export function nextGeneration(cells: Cell[]): Cell[] {
  const cellKey = ([x, y]: Cell) => `${x},${y}`;
  const liveCells = new Set(cells.map(cellKey));
  // True iff the live cells are exactly `expected` -- no extras, none missing.
  const matches = (expected: Cell[]) =>
    expected.length === liveCells.size &&
    expected.every((cell) => liveCells.has(cellKey(cell)));

  for (const { input, output } of PATTERNS) {
    if (matches(input)) return [...output];
  }
  return [];
}
