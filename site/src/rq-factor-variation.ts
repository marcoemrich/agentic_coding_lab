export type RowLabelFactor = "model" | "workflow" | "prompt";
export type LabelledCell = Partial<Record<RowLabelFactor, string>>;

export function rqVaryingLabelColumnsFor(cells: LabelledCell[]): RowLabelFactor[] {
  return (["model", "workflow", "prompt"] as const).filter(
    factor => new Set(cells.map(cell => cell[factor])).size > 1,
  );
}
