import type { LabelledCell, RowLabelFactor } from "./rq-factor-variation.js";

export function labelsFor(cell: LabelledCell, labelColumns: RowLabelFactor[]) {
  return Object.fromEntries(labelColumns.map(factor => [factor, cell[factor]]));
}
