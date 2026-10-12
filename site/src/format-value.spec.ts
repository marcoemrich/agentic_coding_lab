import { describe, expect, it } from "vitest";
import { formatValue } from "./format-value.js";

// Story B of the RQ result table: value formatting.
// A formatted cell has a main text and, for counted outcomes, a sub text shown below it.
describe("Value formatting", () => {
  // Rule 7 and rule 6: plain numeric metrics
  it("shows a single run's value without ± -- avg_loc_per_function n=1, 12 -> '12'", () => {
    expect(formatValue("avg_loc_per_function", { kind: "num", n: 1, value: 12 })).toEqual({ main: "12" });
  });
  it("shows mean ± sd with two decimals below 10 -- 7.4321 ± 1.2345 -> '7.43 ± 1.23'", () => {
    expect(formatValue("avg_loc_per_function", { kind: "num", n: 5, value: 7.4321, sd: 1.2345 })).toEqual({ main: "7.43 ± 1.23" });
  });
  it("grades mean and sd each by its own magnitude -- 14.2 ± 3.1 -> '14.2 ± 3.10'", () => {
    expect(formatValue("avg_loc_per_function", { kind: "num", n: 5, value: 14.2, sd: 3.1 })).toEqual({ main: "14.2 ± 3.10" });
  });
  it("drops decimals from 100 up, sd keeps its own -- 123.4 ± 5.67 -> '123 ± 5.67'", () => {
    expect(formatValue("avg_loc_per_function", { kind: "num", n: 5, value: 123.4, sd: 5.67 })).toEqual({ main: "123 ± 5.67" });
  });
  it("shows exactly 100 without decimals -- n=1, 100 -> '100'", () => {
    expect(formatValue("avg_loc_per_function", { kind: "num", n: 1, value: 100 })).toEqual({ main: "100" });
  });
  it("shows exactly 10 with one decimal -- n=1, 10 -> '10.0'", () => {
    expect(formatValue("avg_loc_per_function", { kind: "num", n: 1, value: 10 })).toEqual({ main: "10.0" });
  });

  // Rule 5: 0–1 metrics as percent, sd in whole points rounded half up
  it("shows verification_pct as percent with sd in points -- 1.0 ± 0 -> '100% ± 0'", () => {
    expect(formatValue("verification_pct", { kind: "num", n: 5, value: 1, sd: 0 })).toEqual({ main: "100% ± 0" });
  });
  it("rounds the sd half up to whole points -- verification_pct 0.96 ± 0.055 -> '96% ± 6'", () => {
    expect(formatValue("verification_pct", { kind: "num", n: 5, value: 0.96, sd: 0.055 })).toEqual({ main: "96% ± 6" });
  });
  it("shows tdd_discipline as percent -- 0.6296 ± 0.0141 -> '63% ± 1'", () => {
    expect(formatValue("tdd_discipline", { kind: "num", n: 5, value: 0.6296, sd: 0.0141 })).toEqual({ main: "63% ± 1" });
  });
  it("shows tdd_discipline_test_first as percent -- n=1, 0.5 -> '50%'", () => {
    expect(formatValue("tdd_discipline_test_first", { kind: "num", n: 1, value: 0.5 })).toEqual({ main: "50%" });
  });
  it("shows tdd_discipline_step as percent -- n=1, 0.5 -> '50%'", () => {
    expect(formatValue("tdd_discipline_step", { kind: "num", n: 1, value: 0.5 })).toEqual({ main: "50%" });
  });
  it("shows tdd_discipline_closure as percent -- n=1, 0.5 -> '50%'", () => {
    expect(formatValue("tdd_discipline_closure", { kind: "num", n: 1, value: 0.5 })).toEqual({ main: "50%" });
  });
  it("shows test_first_rate as percent -- n=1, 0.5 -> '50%'", () => {
    expect(formatValue("test_first_rate", { kind: "num", n: 1, value: 0.5 })).toEqual({ main: "50%" });
  });
  it("shows mutation_score as percent -- n=1, 0.5 -> '50%'", () => {
    expect(formatValue("mutation_score", { kind: "num", n: 1, value: 0.5 })).toEqual({ main: "50%" });
  });
  it("shows a single run's percent without ± -- verification_pct n=1, 0.96 -> '96%'", () => {
    expect(formatValue("verification_pct", { kind: "num", n: 1, value: 0.96 })).toEqual({ main: "96%" });
  });

  // Rule 8 and rule 9: counted outcomes, count below
  it("shows a boolean outcome as share with the count below -- tests_passing 5 of 5 -> '100%' / '5/5'", () => {
    expect(formatValue("tests_passing", { kind: "bool", n: 5, k: 5, value: 1 })).toEqual({ main: "100%", sub: "5/5" });
  });
  it("shows a partial boolean share -- tests_passing 4 of 5 -> '80%' / '4/5'", () => {
    expect(formatValue("tests_passing", { kind: "bool", n: 5, k: 4, value: 0.8 })).toEqual({ main: "80%", sub: "4/5" });
  });
  it("shows a pooled correct rate with correct/total below -- predictions_correct_rate 478 of 480 -> '100%' / '478/480'", () => {
    expect(formatValue("predictions_correct_rate", { kind: "rate", k: 478, t: 480, value: 478 / 480 })).toEqual({ main: "100%", sub: "478/480" });
  });

  // Rule 10: units
  it("shows tokens below one million in k -- total_tokens n=1, 820,000 -> '820k'", () => {
    expect(formatValue("total_tokens", { kind: "num", n: 1, value: 820000 })).toEqual({ main: "820k" });
  });
  it("switches tokens to M at one million -- total_tokens n=1, 1,000,000 -> '1.0M'", () => {
    expect(formatValue("total_tokens", { kind: "num", n: 1, value: 1000000 })).toEqual({ main: "1.0M" });
  });
  it("shows tokens mean and sd compact -- 47,687,463 ± 6,120,333 -> '47.7M ± 6.1M'", () => {
    expect(formatValue("total_tokens", { kind: "num", n: 5, value: 47687463, sd: 6120333 })).toEqual({ main: "47.7M ± 6.1M" });
  });
  it("shows duration in minutes with one decimal -- duration_seconds 1234 ± 310 -> '20.6 ± 5.2 min'", () => {
    expect(formatValue("duration_seconds", { kind: "num", n: 5, value: 1234, sd: 310 })).toEqual({ main: "20.6 ± 5.2 min" });
  });
  it("shows cost in dollars with two decimals -- cost_usd n=1, 38.4934 -> '$38.49'", () => {
    expect(formatValue("cost_usd", { kind: "num", n: 1, value: 38.4934 })).toEqual({ main: "$38.49" });
  });
  it("shows the cost sd in dollars without the sign, as the prototype does -- cost_usd 38.4934 ± 5.1234 -> '$38.49 ± 5.12'", () => {
    expect(formatValue("cost_usd", { kind: "num", n: 5, value: 38.4934, sd: 5.1234 })).toEqual({ main: "$38.49 ± 5.12" });
  });
});
