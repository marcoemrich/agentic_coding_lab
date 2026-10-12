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

const WHOLE_NUMBER_AT = 100;
const ONE_DECIMAL_AT = 10;
const SINGLE_RUN_INTEGER_ABOVE = 10;
const PLAIN_NUMBER_PRECISION = 2;
const USD_PRECISION = 2;
const PERCENT_SCALE = 100;
const TOKENS_PER_MILLION = 1_000_000;
const TOKENS_PER_THOUSAND = 1_000;
const SECONDS_PER_MINUTE = 60;

function formatByMagnitude(value: number): string {
  return value >= WHOLE_NUMBER_AT ? value.toFixed(0) : value >= ONE_DECIMAL_AT ? value.toFixed(1) : value.toFixed(PLAIN_NUMBER_PRECISION);
}

function standardDeviationForDisplay(cell: NumericCell): number | undefined {
  return cell.n > 1 ? cell.sd : undefined;
}

function wholePercentagePoints(value: number): number {
  return Math.round(value * PERCENT_SCALE);
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
  return cell.n === 1 && cell.value > SINGLE_RUN_INTEGER_ABOVE && Number.isInteger(cell.value)
    ? String(cell.value)
    : formatByMagnitude(cell.value);
}

function formatPlainNumber(cell: NumericCell): FormattedValue {
  const mean = formatPlainMean(cell);
  const sd = standardDeviationForDisplay(cell);
  return withDeviation(mean, sd === undefined ? undefined : sd.toFixed(PLAIN_NUMBER_PRECISION));
}

function formatCountedOutcome(value: number, count: number, total: number): FormattedValue {
  return { main: formatPercent(value), sub: `${count}/${total}` };
}

function formatTokenCount(tokens: number): string {
  return tokens >= TOKENS_PER_MILLION ? `${(tokens / TOKENS_PER_MILLION).toFixed(1)}M` : `${(tokens / TOKENS_PER_THOUSAND).toFixed(0)}k`;
}

function formatTokenValue(cell: NumericCell): FormattedValue {
  const sd = standardDeviationForDisplay(cell);
  return withDeviation(formatTokenCount(cell.value), sd === undefined ? undefined : formatTokenCount(sd));
}

function formatDurationValue(cell: NumericCell): FormattedValue {
  const sd = standardDeviationForDisplay(cell);
  const mean = (cell.value / SECONDS_PER_MINUTE).toFixed(1);
  const deviation = sd === undefined ? undefined : (sd / SECONDS_PER_MINUTE).toFixed(1);
  return { main: `${withDeviation(mean, deviation).main} min` };
}

function formatCostAmount(amount: number): string {
  return amount.toFixed(USD_PRECISION);
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
