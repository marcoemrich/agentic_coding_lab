import { describe, expect, it } from "vitest";
import registry from "../../experiments/metrics-registry.yaml";
import { metricEntry } from "./metric-registry.js";

// Every metric the site can show carries a one-sentence explanation for its header tooltip.
describe("Metric registry descriptions", () => {
  it("gives every registry metric a one-sentence description", () => {
    const missing = Object.keys(registry as object).filter(metric => !metricEntry(metric)?.description?.endsWith("."));
    expect(missing).toEqual([]);
  });
});
