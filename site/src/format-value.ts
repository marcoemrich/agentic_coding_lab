import { isPercentageMetric } from "./metric-scale.js";

export interface NumericCell {
  kind: "num";
  n: number;
  value: number;
  sd?: number;
}

export interface BooleanCell {
  kind: "bool";
  n: number;
  k: number;
  value: number;
}

export interface RateCell {
  kind: "rate";
  k: number;
  t: number;
  value: number;
}

export type ValueCell = NumericCell | BooleanCell | RateCell;
export interface FormattedValue { main: string; sub?: string }

function formatByMagnitude(value: number): string {
  return value >= 100 ? value.toFixed(0) : value >= 10 ? value.toFixed(1) : value.toFixed(2);
}

function standardDeviationForDisplay(cell: NumericCell): number | undefined {
  return cell.n > 1 ? cell.sd : undefined;
}

function wholePercentagePoints(value: number): number {
  return Math.round(value * 100);
}

function formatPercent(value: number): string {
  return `${wholePercentagePoints(value)}%`;
}

function withDeviation(mean: string, deviation?: string): FormattedValue {
  return { main: deviation === undefined ? mean : `${mean} ± ${deviation}` };
}

function formatPercentage(cell: NumericCell): FormattedValue {
  const mean = formatPercent(cell.value);
  const sd = standardDeviationForDisplay(cell);
  return withDeviation(mean, sd === undefined ? undefined : String(wholePercentagePoints(sd)));
}

function formatPlainMean(cell: NumericCell): string {
  return cell.n === 1 && cell.value > 10 && Number.isInteger(cell.value)
    ? String(cell.value)
    : formatByMagnitude(cell.value);
}

function formatPlainNumber(cell: NumericCell): FormattedValue {
  const mean = formatPlainMean(cell);
  const sd = standardDeviationForDisplay(cell);
  return withDeviation(mean, sd === undefined ? undefined : sd.toFixed(2));
}

function formatCountedOutcome(value: number, count: number, total: number): FormattedValue {
  return { main: formatPercent(value), sub: `${count}/${total}` };
}

function formatTokenCount(tokens: number): string {
  return tokens >= 1_000_000 ? `${(tokens / 1_000_000).toFixed(1)}M` : `${(tokens / 1000).toFixed(0)}k`;
}

function formatTokenValue(cell: NumericCell): FormattedValue {
  const sd = standardDeviationForDisplay(cell);
  return withDeviation(formatTokenCount(cell.value), sd === undefined ? undefined : formatTokenCount(sd));
}

function formatDurationValue(cell: NumericCell): FormattedValue {
  const sd = standardDeviationForDisplay(cell);
  const mean = (cell.value / 60).toFixed(1);
  const deviation = sd === undefined ? undefined : (sd / 60).toFixed(1);
  return { main: `${withDeviation(mean, deviation).main} min` };
}

function formatCostAmount(amount: number): string {
  return amount.toFixed(2);
}

function formatCostValue(cell: NumericCell): FormattedValue {
  const sd = standardDeviationForDisplay(cell);
  return withDeviation(`$${formatCostAmount(cell.value)}`, sd === undefined ? undefined : formatCostAmount(sd));
}

const unitFormatters: Record<string, (cell: NumericCell) => FormattedValue> = {
  total_tokens: formatTokenValue,
  duration_seconds: formatDurationValue,
  cost_usd: formatCostValue,
};

export function formatValue(metric: string, cell: ValueCell): FormattedValue {
  if (cell.kind === "num") {
    const formatter = unitFormatters[metric] ?? (isPercentageMetric(metric) ? formatPercentage : formatPlainNumber);
    return formatter(cell);
  }
  return formatCountedOutcome(cell.value, cell.k, cell.kind === "bool" ? cell.n : cell.t);
}
