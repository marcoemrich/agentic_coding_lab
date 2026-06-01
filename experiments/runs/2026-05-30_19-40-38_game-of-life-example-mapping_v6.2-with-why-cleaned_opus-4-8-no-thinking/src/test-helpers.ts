import type { Cell } from "./game-of-life.js";

// Cells form an unordered set; sort them into a canonical order
// (by x, then y) so order-insensitive comparisons can use toEqual.
export const sortCells = (cells: Cell[]): Cell[] =>
  [...cells].sort((a, b) => a[0] - b[0] || a[1] - b[1]);
